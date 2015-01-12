'use strict';

var Hapi		= require('hapi'),
	Boom		= require('boom'),
	Bcrypt		= require('bcrypt-nodejs'),
	Users		= require('./users.js'),
	Tokens		= require('./tokens.js');



module.exports = {

	// validation function for basic strategy
	validateBasic: function(username, password, callback) {
		Users.get({
			username: username
		}, function(err, user) {
			if (err || !user) {
				callback(Boom.unauthorized(['user not found'], ['basic']), false);
			} else {
				Bcrypt.compare(password, user.password, function(err, isValid) {
					callback(err, isValid, {
						user: {
							username: user.username,
							name: user.name,
							groups: user.groups
						}
					});
				});
			}
		});
	},


	// validation function for bearer strategy
	validateBearer: function(token, callback) {
		var self = this;

		// get token
		Tokens.get({
			accessToken: token
		}, function(err, token) {
			if (err || !token || !token.owner) {
				callback(err, false);
			} else {

				// user who owns token
				Users.get({
					username: token.owner
				}, function(err, user) {
					if (err || !user) {
						callback(err, false);
					} else {
						callback(err, true, {
							token: token,
							user: {
								username: user.username,
								name: user.name,
								groups: user.groups
							}
						});
					}
				});
			}
		});
	},


	// validation function for cookie strategy
	validateCookie: function(session, callback) {

		Users.get({
			username: session.username
		}, function(err, user) {
			if (err || !user) {
				callback(Boom.unauthorized(['user not found'], ['cookie']), false);
			} else {

				// check password and revoke token
				if (session.hash === user.password &&
					session.revokeToken === user.revokeToken) {

					callback(null, true, {
						user: {
							username: user.username,
							name: user.name,
							groups: user.groups
						}
					});
				} else {
					callback(Boom.unauthorized(['Invalid username or password'], ['cookie']), false);
				}
			}
		});
	}


};