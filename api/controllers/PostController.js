/**
 * PostController
 *
 * @description :: Server-side logic for managing posts
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	restricted: function(req, res){
        return res.ok('If you are seeing this you\'re authenticated!');
    },
    open: function(req, res){
        return res.ok('This is open to everyone!');
    },
    jwt: function(req, res){
        return res.ok('You recieved a JSON web token!');
    }
};

