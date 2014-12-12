
'use strict';
//	data access layer for users

var Url 		= require('url'),
	Hoek 		= require('hoek'),
	Boom 		= require('boom'),
	ShortId 	= require('shortid'),
	Utils 		= require('../lib/utilities.js');


module.exports = {

	// adds a new user
	add: function (options, callback){
		var self = this,
			collection = options.db.collection('users');

		options.item.created = new Date();
		options.item.modified = new Date();
		options.item.revokeToken = ShortId.generate();

		if(!options.item.groups){
			options.item.groups = ['user']
		}

		// add user
		collection.insert(options.item, { safe: true }, function (err, doc) {
		    if (err) {
		    	callback(Boom.badImplementation('Failed to add user to db', err), null);	
		    } else {
		      	callback(null, Utils.cleanDoc(doc));
		    }
		});
	
	},

};


