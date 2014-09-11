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
    reset: function(req, res) {
        res.view();
    },
    password: function(req, res) {
        res.view();
    },
    // route used to [post] verify fields from form before submit
    validation: function(req, res) {
        var params = req.params.all();
        User.findOne({name: params.name}).exec(function(err, user){
            if(err) {
                waterlock.logger.debug(err);
                res.serverError();
            }
            if(!user) {

                return res.ok({valid: true});
            }
            else{
                sails.log.error('Name is in use!');
                return res.ok({valid: false});
            }
        });
    },
    // route to create user, user auth and associate them
    create: function(req, res) {
        var params = req.params.all(),
            auth = {
                email: params.email,
                password: params.password
            },
            userObj = {
                name: params.name,
                title: params.title,
                email: params.email
            };

        User.create(userObj)
            .exec(function (err, user){
                if (err){
                    waterlock.logger.debug(err);
                    req.session.flash = {
                        err: err
                    };

                    return res.redirect('/user/new');
                }
                req.session.user = user;
                req.session.authenticated = true;
                waterlock.engine.attachAuthToUser(auth, user, function (err) {
                    if (err) {
                        waterlock.logger.debug(err);
                        res.redirect('user/new');
                    }
                    user.online = true;
                    user.save(function (err, user) {
                        if (err) {
                            sailsLog('err', err);
                            return next(err);
                        }

                        user.action = " signed-up and logged-in.";

                        User.publishCreate(user);

                        waterlock.logger.debug('user login success');
                        return res.redirect('/user/show/'+user.id);
                    });
                });
            });
    },
    // route to [get] and show user
    show: function(req, res, next) {
        var params = req.params.all()
        User.findOne(params.id, function foundUser(err, user) {
            if(err) {
                waterlock.logger.debug(err);
                return req.serverError();
            }
            if(!user) {
                waterlock.logger.debug('User not found.');
                return next();
            }
            res.view({
                user: user
            });
        });
    },
    // route to [get] and show all users
    index: function(req, res, next) {
        User.find(function foundUsers(err, users) {
            if(err) {
                waterlock.logger.debug(err);
                return req.serverError();
            }
            res.view({
                users: users
            });
        });
    },
    // route used to [get] user fields for edit
    edit: function(req, res, next) {
        var params = req.params.all();
        User.findOne(params.id, function foundUser(err, user) {
            if(err) {
                waterlock.logger.debug(err);
                return req.serverError();
            }
            if(!user) {
                waterlock.logger.debug('User not found.');
                return next();
            }

            res.view({
                user: user
            })
        })
    },
    // route to [post] edited fields and save to user/auth collections
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
            },
            admin = false,
            adminParam = params.admin;

        if (req.session.user.admin) {
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
                waterlock.logger.debug(err);
                return res.redirect('/user/edit/' + params.id);
            }

            if(!authObj.password || authObj.password === 'undefined') {
                delete (authObj.password);
            }

            Auth.update({user: req.session.user.id}, authObj).exec( function(err){
                if(err){
                    waterlock.logger.debug(err);
                    return res.redirect('/user/edit/' + params.id);
                }
                req.session.user.email = params.email;
                res.redirect('/user/show/' + params.id);
            });
        });
    },
    // route to [post] user id to delete user record from user/auth collections
    destroy: function(req, res, next) {
        var params = req.params.all();
        User.unsubscribe(req.socket, params.id);
        User.findOneById(params.id).exec(function(err, usr) {
            if(err) {
                waterlock.logger.debug(err);
                return res.redirect('/user');
            }
            if(!usr) {
                waterlock.logger.debug('User doesn\'t exist.');
                return res.redirect('/user');
            }

            User.destroy({id: usr.id}).exec(function(err, record) {
                if(err) {
                    waterlock.logger.debug(err);
                    return res.redirect('/user');
                }
                var auth = record.map(function(rId){ return rId.id;});
                Auth.destroy({user: auth}).exec(function(err){
                    if(err) {
                        waterlock.logger.debug(err);
                        return res.redirect('/user');
                    }

                    User.publishUpdate(usr.id, {
                        id: usr.id,
                        name: usr.name,
                        action: ' has been destroyed.'
                    });

                    User.publishDestroy(usr.id);
                    res.redirect('/user');
                });
            });
        });
    },
    // route [web socket] to add users for flash messages
    subscribe: function(req, res) {
        User.find(function(err, users) {
            if(err) {
                waterlock.logger.debug(err);
                return res.serverError();
            }

            User.watch(req.socket);

            User.subscribe(req.socket, users);

            res.send(200);
        });
    }
});