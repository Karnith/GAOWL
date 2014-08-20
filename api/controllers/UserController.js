/**
 * UserController.js 
 * 
 * @module      :: Controller
 * @description :: Provides the base user
 *                 actions used to make waterlock work.
 *                 
 * @docs        :: http://waterlock.ninja/documentation
 */

module.exports = require('waterlock').actions.user({
    'new': function(req, res) {
        res.view();
    },

    create: function(req, res, next) {
        var auth = {
                email: req.param('email'),
                password: req.param('password')
            },
            userObj = {
                name: req.param('name'),
                title: req.param('title'),
                email: req.param('email')
            };

        User.create(userObj)
            .exec(function (err, user){
                if (err){
                    sails.log.error(err);
                    req.session.flash = {
                        err: err
                    };

                    return res.redirect('/user/new');
                }
                req.session.user = user;

                user.online = true;
                req.session.authenticated = true;
                user.save(function(err, user) {
                    if(err) {
                        sails.log.error(err);
                        return next(err);
                    }
                    //user.action = " signed-up and logged-in.";
                    waterlock.engine.attachAuthToUser(auth, user, function (err) {
                        if (err) {
                            sails.log.error(err);
                            res.json(err);
                        }
                        else {

                            user.action = " signed-up and logged-in.";

                            User.publishCreate(user);

                            /*User.publishCreate({
                                id: user.id,
                                name: user.name,
                                action: " signed-up and logged-in."
                            });*/
                            waterlock.logger.debug('user login success');
                            return res.redirect('/user/show/'+user.id);
                        }
                    });
                });
            });
    },

    show: function(req, res, next) {
        User.findOne(req.param('id'), function foundUser(err, user) {
            if (err) return next(err);
            if (!user) return next();
            res.view({
                user: user
            });
        });
    },

    index: function(req, res, next) {
        User.find(function foundUsers(err, users) {
            if (err) return next(err);
            res.view({
                users: users
            });
        });
    },

    edit: function(req, res, next) {
        User.findOne(req.param('id'), function foundUser(err, user) {
            if (err) return next(err);
            if (!user) return next();

            res.view({
                user: user
            })
        })
    },

    update: function(req, res, next) {
        var params = req.params.all(),
            userObj = {
                name: params.name,
                title: params.title,
                email: params.email
            },
            authObj = {
                email: params.email,
                password: params.password
            };

        if (req.session.user.admin) {
            // Changed this logic to here. I prefer to send clean stuff to models
            var admin = false;
            var adminParam = req.param('admin');

            if (typeof adminParam !== 'undefined') {
                if (adminParam === 'unchecked') {
                    admin = false;
                } else  if (adminParam[1] === 'on') {
                    admin = true;
                }
            }
            userObj.admin = admin;
        }

        User.update(params.id, userObj).exec(function(err) {
            if (err) {
                sails.log.error(err);
                return res.redirect('/user/edit/' + params.id);
            }

            if(!authObj.password || authObj.password === 'undefined') {
                delete (authObj.password);
            }

            Auth.update({user: req.session.user.id}, authObj).exec( function(err){
                if(err){
                    sails.log.error(err);
                    return res.redirect('/user/edit/' + params.id);
                }
                req.session.user.email = params.email;
                res.redirect('/user/show/' + params.id);
            });
        });
    },

    destroy: function(req, res, next) {
        User.findOne(req.param('id'), function foundUser(err, user) {
            if (err) return next(err);
            if (!user) return next('User doesn\'t exist.');

            User.destroy(req.param('id'), function userDestroyed(err) {
                if (err) return next(err);

                User.publishUpdate(user.id, {
                    name: user.name,
                    action: ' has been destroyed.'
                });

                User.publishDestroy(user.id);
            });

            res.redirect('/user');
        });
    },

    subscribe: function(req, res) {
        User.find(function foundUsers(err, users) {
            if (err) return next(err);

            User.watch(req.socket);

            User.subscribe(req.socket, users);

            res.send(200);
        })
    }
});