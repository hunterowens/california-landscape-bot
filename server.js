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
        url: 'pic3.php', //This is the current doc
        type: "POST",
        dataType: "json",
        data: ({
            uri: picUrl
        }),
    }).done(function (data) {
        // console.log(data.data4)
        let imgSRC = "data:image/png;base64," + data.data4;
        $("#curPic").attr('src', imgSRC);
        $("#modalPic").attr('src', imgSRC);
    }).fail(function (jqXHR, textStatus) {
        console.log(textStatus)
    });
}


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
