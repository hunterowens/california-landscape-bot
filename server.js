/* Setting things up. */
var path = require('path'),
    express = require('express'),
    app = express();
var helpers = require(__dirname + '/helpers.js'),
    twitter = require(__dirname + '/twitter.js'),
    res = null;
var fs = require('fs');
const https = require('https');
app.use(express.static('public'));
/* Setting things up. */
var path = require('path'),
    express = require('express'),
    app = express();
var helpers = require(__dirname + '/helpers.js'),
    twitter = require(__dirname + '/twitter.js'),
    res = null;

app.use(express.static('public'));

/* You can use uptimerobot.com or a similar site to hit your /BOT_ENDPOINT to wake up your app and make your Twitter bot tweet. */
function getPic(url) {
    const picUrl = url
    
    https.post('https://pgewam.lovelytics.info/pge_weather_app/pic3.php', (resp) => {
      let data = '';

      // A chunk of data has been recieved.
      resp.on('data', (chunk) => {
        data += chunk;
      });

      // The whole response has been received. Print out the result.
      resp.on('end', () => {
        console.log(JSON.parse(data).explanation);
      });

      }).on("error", (err) => {
        console.log("Error: " + err.message);
    });
    $.ajax({
        url: 'https://pgewam.lovelytics.info/pge_weather_app/pic3.php', //This is the current doc
        type: "POST",
        dataType: "json",
        data: ({
            uri: picUrl
        }),
    }).done(function (data) {
        // console.log(data.data4)
        let imgSRC = "data:image/png;base64," + data.data4;
        return imgSRC
    }).fail(function (jqXHR, textStatus) {
        console.log(textStatus)
    });
};

function loadRandomCamera() {
  // loads a random camera and construct a tweet 
  // object info 
  fs.readFile('./cameras.json', 'utf8', (err, fileContents) => {
  if (err) {
    console.error(err)
    return
  }
  try {
    const data = JSON.parse(fileContents)
    const site = helpers.randomFromArray(data);
    const url = site['image']['url']
    const name = site['description']
    const lat = site['site']['latitude']
    const long = site['site']['longitude']
    const county = site['site']['county']
    const img = getPic(site['image']['url'])
    console.log(img)
    return helpers.randomFromArray(data);
  } catch(err) {
    console.error(err)
  }
})
};


/* You can use uptimerobot.com or a similar site to hit your /BOT_ENDPOINT to wake up your app and make your Twitter bot tweet. */

app.all(`/${process.env.BOT_ENDPOINT}`, function(req, res) {
  /* See EXAMPLES.js for some example code you can use. */
  /* Example 2: Pick a random image from the assets folder and tweet it. */
  console.log(loadRandomCamera());
});

var listener = app.listen(process.env.PORT, function(){
  console.log('your bot is running on port ' + listener.address().port);
});
