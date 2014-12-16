
'use strict';
//	data access layer for users

var Url 		= require('url'),
	Hoek 		= require('hoek'),
	Boom 		= require('boom'),
	ShortId 	= require('shortid'),
	Config    	= require('../lib/config-manager.js'),
	Database 	= require('../lib/database.js'),
	Utils 		= require('../lib/utilities.js');


var dbOptions = {'url': Config.database.url};


module.exports = {

	// adds a new user
	add: function (options, callback){
		Database.connect(dbOptions, function(err, db){
			if(err){
				callback(Boom.badImplementation('Failed to get db connection', err), null);
			}else{

				var self = this,
					collection = db.collection('users');

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

			}
		});

	},

};


