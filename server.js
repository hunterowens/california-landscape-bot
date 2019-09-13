/* Setting things up. */
var path = require('path'),
    express = require('express'),
    app = express();
var helpers = require(__dirname + '/helpers.js'),
    twitter = require(__dirname + '/twitter.js'),
    res = null;

app.use(express.static('public'));

/* You can use uptimerobot.com or a similar site to hit your /BOT_ENDPOINT to wake up your app and make your Twitter bot tweet. */

app.all(`/${process.env.BOT_ENDPOINT}`, function(req, res) {
  /* See EXAMPLES.js for some example code you can use. */
  /* Example 2: Pick a random image from the assets folder and tweet it. */

  helpers.loadImageAssets(function(err, asset_urls){
    if (err){
      console.log(err);     
      res.sendStatus(500);
    }
    else{
      helpers.loadRemoteImage(helpers.randomFromArray(asset_urls), function(err, img_data){
        if (err){
          console.log(err);     
          res.sendStatus(500);
        }
        else{
          twitter.postImage('Hello 👋', img_data, function(err, data){
            if (err){
              console.log(err);     
              res.sendStatus(500);
            }
            else{
              res.sendStatus(200);
            }            
          });
        }
      });
    }
  });

});

var listener = app.listen(process.env.PORT, function(){
  console.log('your bot is running on port ' + listener.address().port);
});
