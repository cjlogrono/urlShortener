// init project
var express = require('express');
var mongodb = require('mongodb');
var assert = require('assert');
var app = express();

var MongoClient = mongodb.MongoClient;

function validateURL(url) {
    // Checks to see if it is an actual url
    // Regex from https://gist.github.com/dperini/729294
    var regex = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i;
    
    return regex.test(url);
}

var uri = 'mongodb://cjlogrono:incorrect@ds137686.mlab.com:37686/freecodecamp';

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.use("/https:/*", function (req, res) {
  
  var urlParam = "https:/" + req.params[0];
  if(validateURL(urlParam))
    res.redirect("/find/"+req.params[0].slice(1));
  else    
    res.end('Not A Valid URL.......');
});

app.get("/", function (req, res) {
  
    res.render('public/index.html');
});

app.get("/:digit", function (req, res) {
  
  var digit = +req.params.digit;
  if(!isNaN(digit))
      res.redirect("/output/"+digit);   
    else        
      res.end('Not A Valid URL.......');
   
});

app.get("/save/:url", function(req, res){
  
  var urlParam = "https://" + req.params.url;
  MongoClient.connect(uri, function (err, db) {
        
    assert.equal(null, err);
    db.collection('url').count({}, function(err, num){
      
      assert.equal(null, err);

      var doc = {'url': urlParam, 'digit': num + 1};
      db.collection('url').insert(doc, function(){
          db.close();
          res.redirect("/find/" +req.params.url);
      });
    });
  });
});

app.get("/find/:url", function(req, res){
   
  var urlParam = "https://" + req.params.url;
  MongoClient.connect(uri, function (err, db) {
        
        assert.equal(null, err);
        db.collection('url').find({'url': urlParam}, {_id:0}).toArray(function(err, doc) {
            
            assert.equal(err, null);  
            db.close();
            if(doc.length === 0){

              res.redirect('/save/'+req.params.url);
            }else{
              
              res.json(doc);
            }
        });
    });
});

app.get("/output/:digit", function(req, res){
  
  var digit = req.params.digit;
  MongoClient.connect(uri, function (err, db) {
        
    assert.equal(null, err);
    db.collection('url').findOne({'digit': +digit}, function(err, doc) {
      assert.equal(err, null);
      db.close();
      if(doc !== null)
          res.redirect(doc.url);
      else
        res.end('Not A Valid digit.......');     
    });
  });
});

app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
  //the locals variable in res can be used in the error2 file
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
    console.log('Your app is listening on port ' + listener.address().port);
});
