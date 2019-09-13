/* Setting things up. */
var path = require('path'),
    express = require('express'),
    app = express();
var helpers = require(__dirname + '/helpers.js'),
    twitter = require(__dirname + '/twitter.js'),
    res = null;

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
function getPic(id) {
    const picUrl = "https://data.alertwildfire.org/api/firecams/v0/currentimage?name=" + id
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
  const cameras = require('./cameras.json')
  return helpers.randomFromArray(cameras)
}


/* You can use uptimerobot.com or a similar site to hit your /BOT_ENDPOINT to wake up your app and make your Twitter bot tweet. */

app.all(`/${process.env.BOT_ENDPOINT}`, function(req, res) {
  /* See EXAMPLES.js for some example code you can use. */
  /* Example 2: Pick a random image from the assets folder and tweet it. */

  console.log("hello world");
});

var listener = app.listen(process.env.PORT, function(){
  console.log('your bot is running on port ' + listener.address().port);
});
