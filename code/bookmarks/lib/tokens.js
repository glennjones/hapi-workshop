
'use strict';
//	data access layer for tokens

var Url 		= require('url'),
	Hoek 		= require('hoek'),
	Boom 		= require('boom'),
	Randtoken 	= require('rand-token'),
	Config    	= require('../lib/config-manager.js'),
	Database 	= require('../lib/database.js'),
	Utils 		= require('../lib/utilities.js');
	

var dbOptions = {'url': Config.database.url},
	expiresIn = 31536000; // one year of seconds

/*token structure
{
    "owner" : "glennjones",
    "scope" : "content:read,content:write",
    "expire" : 1414555583,
    "created" : ISODate("2014-10-28T16:06:23.490Z"),
    "accessToken" : "rYyHrS1aeaGdSubAH3fRKE4GzLrm5DEoDII8lSDfXQJVeLe61e3WO3hhXXClbyQD",
    "refreshToken" : "rYyHrS1aeaGdSubAH3fRKE4GzLrm5DEoDII8lSDfXQJVeLe61e3WO3hhXXClbyQD",
    "_id" : ObjectId("544fbefff178dcd74b000005")
}
*/



module.exports = {

	// adds a new token
	add: function (options, callback){
		Database.connect(dbOptions, function(err, db){
			if(err && !db){
				callback(Boom.badImplementation('Failed to connect to db', err), null);
			}else{
				var url;

				options.item.accessToken = Randtoken.generate(32);;
				options.item.refreshToken = Randtoken.generate(32);;
				options.item.created = new Date();
				options.item.modified = new Date();
				options.item.expires = Math.floor(Date.now()/1000) + expiresIn;

				db.collection('tokens').insert(options.item, { safe: true }, function (err, doc) {
				    if (err) {
				    	callback(Boom.badImplementation('Failed to add token to db', err), null);	
				    } else {
				      	callback(null, Utils.cleanDoc(doc));
				    }
				});
			}
		});
	},


	// get a single token
	get: function(options, callback){
		Database.connect(dbOptions, function(err, db){
			if(err && !db){
				callback(Boom.badImplementation('Failed to connect to db', err), null);
			}else{
				db.collection('tokens').findOne( this.buildQuery(options), function(err, doc){
					if(doc){
						callback(null, Utils.cleanDoc(doc));
					}else{
						callback(Boom.notFound('token not found'), null);
					}
				});
			}
		});
	},


	// remove token from collection using accessToken
	remove: function(options, callback){
		Database.connect(dbOptions, function(err, db){
			if(err && !db){
				callback(Boom.badImplementation('Failed to connect to db', err), null);
			}else{
				db.collection('tokens').findAndRemove( this.buildQuery(options), function(err, doc) {
					if(!doc){
						callback(Boom.notFound('token not found', err), null);
					}else{
						callback(err, Utils.cleanDoc(doc));	
					}
				});
			}
		});
	},


	// build query either by token or username
	buildQuery: function(options){
		var query = {}
		if(options.accessToken){
			query = {'accessToken': options.accessToken}
		}
		if(options.owner){
			query = {'owner': options.owner}
		}
		return query;
	}

};


