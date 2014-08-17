/**
 * Policy: flash.js
 * Description: flash policy for sails
 *
 * Created by mmarino on 8/15/2014.
 */
module.exports = function(req, res, next) {
    res.locals.flash = {};

    if (!req.session.flash) return next();

    res.locals.flash = _.clone(req.session.flash);

    req.session.flash = {};

    next();
};