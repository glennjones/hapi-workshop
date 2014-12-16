
'use strict';
//	data access layer for bookmarks

var Url 		= require('url'),
	Hoek 		= require('hoek'),
	Boom 		= require('boom'),
	ShortId 	= require('shortid'),
	Config    	= require('../lib/config-manager.js'),
	Database 	= require('../lib/database.js'),
	Utils 		= require('../lib/utilities.js');


var dbOptions = {'url': Config.database.url};
	

module.exports = {

	// adds a new bookmark
	add: function (options, callback){
		Database.connect(dbOptions, function(err, db){
			if(err){
				callback(Boom.badImplementation('Failed to get db connection', err), null);
			}else{
				var url,
					collection = db.collection('bookmarks');

				options.item.id = ShortId.generate();
				options.item.created = new Date();
				options.item.modified = new Date();

				// validate string url using node lib
				url = Url.parse(options.item.url)
				if( url ){

					options.item.host = url.host;
					collection.insert(options.item, { safe: true }, function (err, doc) {
					    if (err) {
					    	callback(Boom.badImplementation('Failed to add bookmark to db', err), null);	
					    } else {
					      	callback(null, Utils.cleanDoc(doc));
					    }
					});

				}else{
					callback(Boom.badRequest('Url was not parsable'), null);
				}
			}
		});
	},

};


