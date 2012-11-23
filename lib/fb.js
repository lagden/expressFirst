var methods = exports.methods = {
    render_page: function(req, res){
        req.facebook.app(function(app) {
            req.facebook.me(function(user) {
                res.render('index', {
                    //layout:    false,
                    req: req,
                    app: app,
                    user: user
                });
            });
        });        
    }
    ,handle_facebook_request: function(req, res, next){
        // if the user is logged in
        if (req.facebook.token) {

            async.parallel([
                function(cb){
                    // query 4 friends and send them to the socket for this socket id
                    req.facebook.get('/me/friends', { limit: 4 }, function(friends) {
                        req.friends = friends;
                        cb();
                    });
                }
                ,function(cb) {
                    // query 16 photos and send them to the socket for this socket id
                    req.facebook.get('/me/photos', { limit: 16 }, function(photos) {
                        req.photos = photos;
                        cb();
                    });
                }
                ,function(cb) {
                    // query 4 likes and send them to the socket for this socket id
                    req.facebook.get('/me/likes', { limit: 4 }, function(likes) {
                        req.likes = likes;
                        cb();
                    });
                }
                ,function(cb) {
                    // use fql to get a list of my friends that are using this app
                    req.facebook.fql('SELECT uid, name, is_app_user, pic_square FROM user WHERE uid in (SELECT uid2 FROM friend WHERE uid1 = me()) AND is_app_user = 1', function(result) {
                        req.friends_using_app = result;
                        cb();
                    });
                }
            ]
            ,function() {
                methods.render_page(req, res);
            });
        }
        else
            methods.render_page(req, res);
    }
}
