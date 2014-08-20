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
        var params = req.params.all(),
            usernamePasswordRequiredError;
        if (!params.email || !params.password) {
            usernamePasswordRequiredError = [
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
            if(err) {
                sails.log.error(err);
                return next(err);
            }
            if (user) {
                req.session.user = user;
                if(bcrypt.compareSync(params.password, user.auth.password)){

                    req.session.authenticated = true;

                    user.online = true;
                    delete (req.session.user.auth);
                    user.save(function(err, user) {
                        if(err) {
                            sails.log.error(err);
                            return next(err);
                        }

                        User.publishUpdate(user.id, {
                            loggedIn: true,
                            id: user.id,
                            name: user.name,
                            action: ' has logged in.'
                        });


                        if (req.session.user.admin) {
                            res.redirect('/user');
                            return;
                        }
                        waterlock.logger.debug('user login success');
                        res.redirect('/user/show/' + user.id);
                    });
                }else{
                    if(err) {
                        sails.log.error(err);
                        return res.redirect('session/new')
                    }
                    return res.redirect('session/new');
                }
            } else {
                //TODO redirect to register
                if(err) {
                    sails.log.error(err);
                    return res.redirect('session/new');
                }
                return res.redirect('session/new');
            }
        });
    },

    destroy: function(req, res, next) {
        User.findOne(req.session.user.id, function foundUsers(err, user) {
            var userId = req.session.user.id;

            if(user) {
                User.unsubscribe(req.socket, userId);
                User.update(userId, {
                        online: false
                    },
                    function(err) {
                        if(err) {
                            sails.log.error(err);
                            return next(err);
                        }

                        User.publishUpdate(userId, {
                            loggedIn: false,
                            id: user.id,
                            name: user.name,
                            action: ' has logged out.'
                        });

                    req.session.destroy();

                    waterlock.logger.debug('user logout');

                    res.redirect('/');
                });
            } else {
                req.session.destroy();
                User.unsubscribe(req.socket, userId);
                waterlock.logger.debug('user logout');

                res.redirect('/');
            }
        });
    }
};

