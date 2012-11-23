// require
var async = require('async')
    ,express = require('express')
    ,util    = require('util');

// app
var app = module.exports = express();

// engine
app.engine('jade', require('jade').__express);
app.set('view engine', 'jade');
app.set('views', __dirname + '/views');

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
app.set('appDescription','Descubra o que aconteceu no dia em que você nasceu.');
app.set('title','Movimento Respirar - Controlar');

// Facebook Methods
var fb = require('./lib/fb');

app.get('/', fb.methods.handle_facebook_request);
app.post('/', fb.methods.handle_facebook_request);


// listen to the PORT given to us in the environment
var port = process.env.PORT || 3000;

app.listen(port, function(){
    console.log("Listening on " + port);
});