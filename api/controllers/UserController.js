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
        var params = waterlock._utils.allParams(req),
            auth = {
                email: params.email,
                password: params.password
            },
            userObj = {
                name: params.name,
                title: params.title,
                email: params.email
            };
/*            headderParams = [
                'params.confirmation',
                'params._csrf',
                'params.host',
                'params.connection',
                'params.content-length',
                'params.cache-control',
                'params.accept',
                'params.origin',
                'params.user-agent',
                'params.content-type',
                'params.referer',
                'params.accept-encoding',
                'params.accept-language',
                'params.cookie',
                'params.email',
                'params.password'
            ];
        delete(params.confirmation);
        delete(params._csrf);
        delete(params.host);
        delete(params.connection);
        delete(params.content-length);
        delete(params.cache-control);
        delete(params.accept);
        delete(params.origin);
        delete(params.user-agent);
        delete(params.content-type);
        delete(params.referer);
        delete(params.accept-encoding);
        delete(params.accept-language);
        delete(params.cookie);
        delete(params.email);
        delete(params.password);
*/

        User.create(userObj)
            .exec(function (err, user){
                if (err){
                    sails.log.error(err);
                    req.session.flash = {
                        err: err
                    };

                    return res.redirect('/user/new');
                }
                req.session.User = user;

                user.online = true;
                req.session.authenticated = true;
                user.save(function(err, user) {
                    if (err) return next(err);

                    user.action = " signed-up and logged-in.";
                    waterlock.engine.attachAuthToUser(auth, user, function (err) {
                        if (err) {
                            res.json(err);
                        }
                        else {
                            waterlock.cycle.loginSuccess(req, res, user);
                            //sails.log.warn(ua);
                            //sails.log.error(req.session);
                            return res.redirect('/user/show/'+user.id);
                        }
                    });
                });
            });
    },

    show: function(req, res, next) {
        var params = waterlock._utils.allParams(req);
        User.findOne(params.id, function foundUser(err, user) {
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
        var params = waterlock._utils.allParams(req);
        User.findOne(params.id, function foundUser(err, user) {
            if (err) return next(err);
            if (!user) return next();

            res.view({
                user: user
            })
        })
    },

    update: function(req, res, next) {
        var params = waterlock._utils.allParams(req),
            userObj = {
            name: params.name,
            title: params.title,
            email: params.email
        };

        if (req.session.User.admin) {
            // Changed this logic to here. I prefer to send clean stuff to models
            var admin = false;
            var adminParam = params.admin;

            if (typeof adminParam !== 'undefined') {
                if (adminParam === 'unchecked') {
                    admin = false;
                } else  if (adminParam[1] === 'on') {
                    admin = true;
                }
            }
            userObj.admin = admin;
        }

        User.update(params.id, userObj, function userUpdated (err) {
            if (err) {
                sails.log.error(err);
                return res.redirect('/user/edit/' + params.id);
            }

            res.redirect('/user/show/' + params.id);
        });
    },

    destroy: function(req, res, next) {
        var params = waterlock._utils.allParams(req);
        User.findOne(params.id, function foundUser(err, user) {
            if (err) return next(err);
            if (!user) return next('User doesn\'t exist.');

            User.destroy(params.id, function userDestroyed(err) {
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