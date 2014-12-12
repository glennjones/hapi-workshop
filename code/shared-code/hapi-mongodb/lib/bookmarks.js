
'use strict';
//	data access layer for bookmarks

var Url 		= require('url'),
	Hoek 		= require('hoek'),
	Boom 		= require('boom'),
	ShortId 	= require('shortid'),
	Utils 		= require('../lib/utilities.js');
	

module.exports = {

	// adds a new bookmark
	add: function (options, callback){
		var url,
			collection = options.db.collection('bookmarks');

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
	},

};


