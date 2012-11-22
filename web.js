// require
var async = require('async')
    ,express = require('express')
    ,util    = require('util');

// app
var app = module.exports = express();

// engine
// app.engine('.html', require('ejs').__express);
app.engine('.html', require('ejs-locals'));
app.set('views', __dirname + '/views');
app.set('view engine', 'html');

// Config
app.configure(function(){

    app.use(express.logger());
    app.use(express.static(__dirname + '/public'));
    app.use(express.cookieParser());
    app.use(express.bodyParser());
    app.use(express.session({ secret: process.env.SESSION_SECRET || 'ulala123' }));
    app.use(require('faceplate').middleware({
        app_id: process.env.FACEBOOK_APP_ID
        ,secret: process.env.FACEBOOK_SECRET
        ,scope:  'user_likes,user_photos,user_photo_video_tags'
    }));

    app.use(function(req, res, next){
        app.locals({
            host: function(){ return req.headers['host']; }
            ,scheme: function(){ return req.headers['x-forwarded-proto'] || 'http'; }
            ,url_no_scheme: function(path){ return '://' + app.locals.host() + path; }
            ,url: function(path){ return app.locals.scheme() + app.locals.url_no_scheme(path); }
        });
        next();
    });
});

app.set('appName','Movimento Respirar - Controlar');
app.set('title','Movimento Respirar - Controlar');

function render_page(req, res){
    req.facebook.app(function(app) {
        req.facebook.me(function(user) {
            res.render('index', {
                layout:    false,
                req:       req,
                app:       app,
                user:      user
            });
        });
    });
}

function handle_facebook_request(req, res, next) {

  // if the user is logged in
  if (req.facebook.token) {

    async.parallel([
      function(cb) {
        // query 4 friends and send them to the socket for this socket id
        req.facebook.get('/me/friends', { limit: 4 }, function(friends) {
          req.friends = friends;
          cb();
        });
      },
      function(cb) {
        // query 16 photos and send them to the socket for this socket id
        req.facebook.get('/me/photos', { limit: 16 }, function(photos) {
          req.photos = photos;
          cb();
        });
      },
      function(cb) {
        // query 4 likes and send them to the socket for this socket id
        req.facebook.get('/me/likes', { limit: 4 }, function(likes) {
          req.likes = likes;
          cb();
        });
      },
      function(cb) {
        // use fql to get a list of my friends that are using this app
        req.facebook.fql('SELECT uid, name, is_app_user, pic_square FROM user WHERE uid in (SELECT uid2 FROM friend WHERE uid1 = me()) AND is_app_user = 1', function(result) {
          req.friends_using_app = result;
          cb();
        });
      }
    ], function() {
      render_page(req, res);
    });

  } else {
    render_page(req, res);
  }
}

app.get('/', handle_facebook_request);
app.post('/', handle_facebook_request);


// listen to the PORT given to us in the environment
var port = process.env.PORT || 3000;

app.listen(port, function(){
    console.log("Listening on " + port);
});