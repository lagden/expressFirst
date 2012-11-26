// require
var express = require('express')
    , util = require('util')
    , fb = require('./lib/fb')
    , db = require('./lib/db')
    , app = module.exports = express()
    , http = require('http')
    , server = http.createServer(app)
    , io = require('socket.io').listen(server)
    ;

// engine
app.engine('jade', require('jade').__express);
app.set('view engine', 'jade');
app.set('views', __dirname + '/views');

// config
app.configure(function(){
    app.use(express.logger());
    app.use(express.static(__dirname + '/public'));
    app.use(express.cookieParser());
    app.use(express.bodyParser());
    app.use(express.session({ secret: process.env.SESSION_SECRET || 'ulala123' }));
    app.use(require('faceplate').middleware({
        app_id: process.env.FACEBOOK_APP_ID
        ,secret: process.env.FACEBOOK_SECRET
        ,scope: null
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

// Heroku won't actually allow us to use WebSockets
// so we have to setup polling instead.
// https://devcenter.heroku.com/articles/using-socket-io-with-node-js-on-heroku
io.configure(function (){
    io.set("transports", ["xhr-polling"]);
    io.set("polling duration", 10);
});

// set
app.set('appName','Movimento Respirar - Controlar');
app.set('appDescription','Descubra o que aconteceu no ano em que você nasceu.');
app.set('title', app.get('appName'));

// routes
app.get('/', fb.methods.handle_facebook_request);
app.post('/', fb.methods.handle_facebook_request);

// for manual request
app.get('/consulta/:ano', function(req, res, next){
    var ano = db.anos[req.params.ano] || false;
    (ano)
        ? res.json(200, {resultado: ano, msg: 'Olha só o que estava acontecendo em  ' + req.params.ano + ', o ano em que você nasceu:'})
        : res.json(500, {err: 'Ops! Não encontramos registros para o ano de ' + req.params.ano + ', faça uma nova pesquisa.'});
});

// socket.io
io.sockets.on('connection', function (socket){
    socket.on('click:consulta', function (data){
        var ano = db.anos[data.ano] || false;
        (ano)
            ? socket.emit('200', {resultado: ano, msg: 'Olha só o que estava acontecendo em  ' + data.ano + ', o ano em que você nasceu:'})
            : socket.emit('500', {err: 'Ops! Não encontramos registros para o ano de ' + data.ano + ', faça uma nova pesquisa.'});
    });
});

// Use the port that Heroku provides or default to 5000
var port = process.env.PORT || 5000;
server.listen(port, function(){
    console.log("Express server and Socket.io listening on port %d", port);
});