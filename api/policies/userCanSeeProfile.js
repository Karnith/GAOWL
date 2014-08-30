/**
 * Policy: userCanSeeProfile.js
 * Description: profile policy for sailsjs
 *
 * Created by mmarino on 8/15/2014.
 */
module.exports = function(req, res, ok) {

    if (!req.session.user) {
        res.redirect('/session/new');
        return;
    }

    var sessionUserMatchesId = req.session.user.id.toString() === req.param('id');
    var isAdmin = req.session.user.admin;

    // The requested id does not match the user's id,
    // and this is not an admin
    if (!(sessionUserMatchesId || isAdmin)) {
        var noRightsError = [{name: 'noRights', message: 'You must be an admin.'}];
        req.session.flash = {
            err: noRightsError
        };
        res.redirect('/session/new');
        return;
    }

    ok();

};