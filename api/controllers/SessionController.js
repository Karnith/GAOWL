/**
 * SessionController
 *
 * @description :: Server-side logic for managing sessions
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var bcrypt = require('bcryptjs');
module.exports = {
    'new': function(req, res) {
        res.view('session/new');
    },

    'create': function(req, res, next) {
        var params = waterlock._utils.allParams(req);
        if(waterlock._utils.countTopLevel(waterlock.methods) === 1){
            params.type = waterlock._utils.accessObjectLikeArray(0, waterlock.methods).authType;
        }

        if (!params.email || !params.password) {
            var usernamePasswordRequiredError = [
                {
                    name: 'usernamePasswordRequired',
                    message: 'You must enter both a username and password.'
                }];

            req.session.flash = {
                err: usernamePasswordRequiredError
            };

            return res.redirect('/session/new');
        }

        User.findOneByEmail(params.email).populate('auth').exec(function(err, user){
            if (user) {
                if(bcrypt.compareSync(params.password, user.auth.password)){

                    req.session.authenticated = true;
                    req.session.User = user;

                    user.online = true;
                    user.save(function(err, user) {
                        if (err) return next(err);

                        User.publishUpdate(user.id, {
                            loggedIn: true,
                            id: user.id,
                            name: user.name,
                            action: ' has logged in.'
                        });


                        if (req.session.User.admin) {
                            res.redirect('/user');
                            return;
                        }
                        waterlock.cycle.loginSuccess(req, res, user);

                        res.redirect('/user/show/' + user.id);
                    });
                }else{
                    waterlock.cycle.loginFailure(req, res, user, {error: 'Invalid '+scope.type+' or password'});
                }
            } else {
                //TODO redirect to register
                waterlock.cycle.loginFailure(req, res, null, {error: 'user not found'});
            }
        });
    },

    destroy: function(req, res, next) {
        User.findOne(req.session.User.id, function foundUsers(err, user) {
            var userId = req.session.User.id;

            if (user) {
                User.update(userId, {
                    online: false
                }, function(err) {
                    if (err) return next(err);

                    User.publishUpdate(user.id, {
                        loggedIn: false,
                        id: user.id,
                        name: user.name,
                        action: ' has logged out.'
                    });

                    req.session.destroy();

                    res.redirect('/session/new');
                });
            } else {
                req.session.destroy();

                res.redirect('/session/new');
            }
        });
    }
};

