/* Setting things up. */
var helpers = require(__dirname + "/helpers.js"),
  twitter = require(__dirname + "/twitter.js"),
  res = null;
var fs = require("fs");
const request = require("request");
const GIFEncoder = require("gifencoder");
const { createCanvas, loadImage } = require("canvas");
const bsplit = require("buffer-split");
const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");
const argv = yargs(hideBin(process.argv)).argv;

var helpers = require(__dirname + "/helpers.js"),
  twitter = require(__dirname + "/twitter.js"),
  res = null;

function getPic(url) {
  const picUrl = url;
  request.post(
    "https://pgewam.lovelytics.info/pge_weather_app/pic3.php",
    { form: { uri: picUrl } },
    function optionalCallback(err, httpResponse, body) {
      if (err) {
        return console.error("upload failed:", err);
      } else if (httpResponse) {
        console.log("got image " + picUrl);
        return "data:image/png;base64," + JSON.parse(body)["data4"];
      }
    }
  );
}

function getRandomCamera(callback, options) {
  if (!options) options = {};

  request.get(
    {
      url: "http://s3-us-west-2.amazonaws.com/alertwildfire-data-public/all_cameras-v2.json",
      headers: {
        Origin: "http://www.alertwildfire.org",
        Host: "s3-us-west-2.amazonaws.com",
        Referer: "http://www.alertwildfire.org/",
      },
    },
    (err, fileContents) => {
      if (err) {
        console.error(err);
        return;
      }

      const data = JSON.parse(fileContents.body);
      let features = data.features;

      if (options.gif) {
        features = features.filter(f => f.properties.is_patrol_mode == 0);
      }

      let site = helpers.randomFromArray(features);

      if (argv.site) {
        let sites = data.features.filter(
          (f) => f.properties.id.toLowerCase() == argv.site.toLowerCase()
        );
        if (sites.length == 1) {
          site = sites[0];
        }
      }

      const id = site.properties.id;
      const url =
        "https://data.alertwildfire.org/api/firecams/v0/currentimage?name=" +
        id;

      let network = site.properties.network;
      if (network === "laorange") network = "orangecoca";

      const camera_url =
        "http://www.alertwildfire.org/" + network + "/index.html?camera=" + id;

      const name = site.properties.name;
      const alt = site.geometry.coordinates[2] * 1000 * 3.28084;
      const lat = (+site.geometry.coordinates[1]).toFixed(4);
      const long = (+site.geometry.coordinates[0]).toFixed(4);
      const azimuth = +site.properties.az_current;

      const county = site.properties.county;
      const state = site.properties.state;

      callback({
        name,
        id,
        url,
        alt,
        lat,
        long,
        county,
        state,
        azimuth,
        camera_url,
      });
    }
  );
}

async function writeGif(frames, callback) {
  if (!fs.existsSync("frames")) {
    fs.mkdirSync("frames");
  }

  const encoder = new GIFEncoder(480, 270);

  let stream = encoder.createReadStream().pipe(fs.createWriteStream("tmp.gif"));

  encoder.setRepeat(0); // 0 for repeat, -1 for no-repeat
  encoder.setDelay(60); // frame delay in ms
  encoder.setQuality(100); // image quality. 10 is default. Higher is lower quality.
  encoder.start();

  let maxFrames = 160;
  let skip = Math.ceil((frames.length - 0) / maxFrames);
  if (skip < 1) skip = 1;
  let start = 0;

  let mode = helpers.randomFromArray(["smooth", "all"]);
  if (argv.mode && (argv.mode == "smooth" || argv.mode == "all")) {
    mode = argv.mode;
  }

  if (mode === "smooth") {
    skip = 1;
    start = frames.length - maxFrames - 1;
    if (start < 0) start = 0;
  }

  console.log("Generating GIF with mode " + mode);

  // use node-canvas
  const canvas = createCanvas(480, 270);
  const ctx = canvas.getContext("2d");

  for (let i = start; i < frames.length; i++) {
    let frame = frames[i];

    if (i % skip === 0) {
      fs.writeFileSync(
        "frames/" + i + ".jpg",
        frame.slice(0, frame.length - 2)
      );

      try {
        let image = await loadImage("frames/" + i + ".jpg");
        ctx.drawImage(image, 0, 0, 480, 270);
        encoder.addFrame(ctx);
      } catch (e) {
        console.log(e);
      }

      fs.unlinkSync("frames/" + i + ".jpg");
    }
  }

  encoder.finish();

  stream.on("finish", function () {
    console.log("finished GIF");
    callback();
  });
}

function generateTweetText({
  name,
  county,
  state,
  lat,
  long,
  alt,
  azimuth,
  camera_url,
}) {
  azimuth = -azimuth;

  let directions = [
    "north",
    "northwest",
    "west",
    "southwest",
    "south",
    "southeast",
    "east",
    "northeast",
  ];
  let direction =
    directions[
      Math.round(((azimuth %= 360) < 0 ? azimuth + 360 : azimuth) / 45) % 8
    ];

  return (
    name +
    ", " +
    county +
    " County, " +
    state +
    "\n" +
    lat +
    ", " +
    long +
    "\n" +
    Math.round(alt) +
    " ft above sea level, facing " +
    direction +
    "\n" +
    camera_url
  );
}

if (argv.gif) {
  getRandomCamera(
    ({ id, name, county, state, lat, long, alt, url, azimuth, camera_url }) => {
      const durations = ["15m", "1h", "3h", "6h", "12h"];

      let length;

      if (argv.duration && durations.indexOf(argv.duration) >= 0) {
        length = argv.duration;
      } else {
        length = helpers.randomFromArray(durations);
      }

      const frames =
        "http://ts1.alertwildfire.org/text/timelapse/?source=" +
        id.toLowerCase() +
        "&preset=" +
        length +
        "&nocache=" +
        Date.now();

      console.log("Fetching timelapse frames: " + frames);
      request.get(
        {
          url: frames,
          encoding: null,
          followRedirects: true,
          followAllRedirects: true,
          headers: {
            Accept:
              "image/png,image/svg+xml,image/*;q=0.8,video/*;q=0.8,*/*;q=0.5",
            "User-Agent":
              "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.1.1 Safari/605.1.15",
            Referer:
              "http://www.alertwildfire.org/orangecoca/index.html?camera=Axis-SanSevaine1&v=81e002f",
            Origin: "http://www.alertwildfire.org",
            Connection: "keep-alive",
            Host: "ts1.alertwildfire.org",
          },
        },
        (err, fileContents) => {
          if (err) {
            console.error(err);
          }

          let frames = bsplit(
            fileContents.body,
            Buffer.from("FFD8FF", "hex"),
            true
          ).slice(1);

          frames = frames
            .map((f) => {
              let buf = Buffer.concat([Buffer.from("FFD8FF", "hex"), f]);
              let bufsplit = bsplit(buf, Buffer.from("FFD9", "hex"));
              if (bufsplit.length < 2) return false;
              return Buffer.concat([bufsplit[0], Buffer.from("FFD9", "hex")]);
            })
            .filter((f) => f !== false);

          writeGif(frames, () => {
            twitter.postMediaChunked(
              generateTweetText({
                name,
                county,
                state,
                lat,
                long,
                alt,
                azimuth,
                camera_url,
              }),
              "./tmp.gif",
              function (err, data) {
                if (err) {
                  console.log(err);
                  console.log(err.twitterReply.errors);
                }
              }
            );
          });
        }
      );
    },
    { gif: true }
  );
} else {
  getRandomCamera(
    ({ name, county, state, lat, long, alt, url, azimuth, camera_url }) => {
      request.post(
        "https://pgewam.lovelytics.info/pge_weather_app/pic3.php",
        { form: { uri: url } },
        (err, httpResponse, body) => {
          if (err) {
            return console.error("upload failed:", err);
          } else if (httpResponse) {
            let imgSRC = JSON.parse(body)["data4"];

            twitter.postImage(
              generateTweetText({
                name,
                county,
                state,
                lat,
                long,
                alt,
                azimuth,
                camera_url,
              }),
              imgSRC,
              (err) => {
                if (err) console.log(err);
              }
            );
          }
        }
      );
      return getPic(url);
    }
  );
}
