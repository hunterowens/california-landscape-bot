/* Setting things up. */
var path = require('path'),
    express = require('express'),
    app = express();
var helpers = require(__dirname + '/helpers.js'),
    twitter = require(__dirname + '/twitter.js'),
    res = null;
var fs = require('fs');
const request = require('request');

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
function getPic(url, callback) {
  const picUrl = url
    request.post('https://pgewam.lovelytics.info/pge_weather_app/pic3.php', {form:{uri:picUrl}} , function optionalCallback(err, httpResponse, body) {
      if (err) {
        return console.error('upload failed:', err);
      }
      else if (httpResponse) {  
        console.log("httpResponseHappened")
        let imgSRC = 'data:image/png;base64,' + JSON.parse(body)['data4'];
        return imgSRC;
        callback();
      }
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
    return img;
  } catch(err) {
    console.error(err)
  }
})
};


/* You can use uptimerobot.com or a similar site to hit your /BOT_ENDPOINT to wake up your app and make your Twitter bot tweet. */

app.all(`/${process.env.BOT_ENDPOINT}`, function(req, res) {
  /* See EXAMPLES.js for some example code you can use. */
  /* Example 2: Pick a random image from the assets folder and tweet it. */
  console.log("camera img:" + loadRandomCamera());
});

var listener = app.listen(process.env.PORT, function(){
  console.log('your bot is running on port ' + listener.address().port);
});
