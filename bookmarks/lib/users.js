
'use strict';
//	data access layer for users

var Url 		= require('url'),
	Hoek 		= require('hoek'),
	Boom 		= require('boom'),
	Bcrypt  	= require('bcrypt-nodejs'),
	ShortId 	= require('shortid'),
	Tokens      = require('../lib/tokens.js').Tokens,
	Utils 		= require('../lib/utilities.js');
	

function Users (db) {
	var self = this;
	this.db = db;
	this.collection = this.db.collection('users');
	this.tokens = new Tokens( db );
}


/*user structure
{
    "username" : "glennjones",
    "name" : "Glenn Jones",
    "email": "glennjonesnet@gamil.com"
    "password" : '$2a$10$XPk.7lupEzBSHxUg/IavSuIKmwmpBbW0NfCL8q0ZfHXUPXTtbhmNK',   // 'password'
    "created" : ISODate("2014-10-28T16:06:23.490Z"),
    "modified" : ISODate("2014-10-28T16:06:23.490Z"),
    "groups" : ['admin','user']
}
*/


Users.prototype = {

	// adds a new user
	add: function (options, callback){
		var self = this;

		this.get({username: options.item.username}, function(err, user){
			if(!err && user){
				callback('User already exists', null);	
			}else{
				options.item.created = new Date();
				options.item.modified = new Date();
				options.item.revokeToken = ShortId.generate();

				if(!options.item.groups){
					options.item.groups = ['user']
				}

				// hash the password so its unreadable
				Bcrypt.hash(options.item.password, null, null, function (err, hash) {
					options.item.password = hash;

					// add user
					self.collection.insert(options.item, { safe: true }, function (err, doc) {
					    if (err) {
					    	callback(Boom.badImplementation('Failed to add user to db', err), null);	
					    } else {

							// add token for this user
							self.tokens.add({
									item: {
										owner : options.item.username,
				    					scope : '',
								}
							}, function(){})

					      	callback(null, Utils.cleanDoc(doc));
					    }
					});
				});
			}
		});
	},



	// update an existing user
	update: function (options, callback){
		var self = this;

		this.get(options, function(err, doc){
			if(doc){

				// explicit property update
				doc.username = options.username;
				doc.name = options.item.name;
				doc.email = options.item.email;
				doc.groups = options.item.groups;

				// update modified timestamp
				doc.modified = new Date();

				// hash the password so its unreadable
				Bcrypt.hash(options.item.password, null, null, function (err, hash) {
					doc.password = hash;

					// save changes
					self.collection.update( {'username': options.username}, doc, function(err, count){
						if(!count || count === 0){
							callback(Boom.notFound('user not found', err), null);
						}else{
							self.get(options, callback);
						}
					});
				});

			}else{
				callback(Boom.notFound('user not found'), null);
			}
		});
	},



	// get a single user
	get: function(options, callback){
		this.collection.findOne( {'username': options.username}, function(err, doc){
			if(doc){
				callback(null, Utils.cleanDoc(doc));
			}else{
				callback(Boom.notFound('user not found'), null);
			}
		});
	},



	// find a list of user that match a query
	find: function(options, callback){
		var cursor,
			defaults,
			skipFrom,
			self = this;

		defaults = {
			page: 1,
			pageSize: 10,
			sort: {modified:-1},
			query: {}
		}

		options = Hoek.applyToDefaults(defaults, options);
		skipFrom = (options.page * options.pageSize) - options.pageSize;

		// create and fire query
		cursor = this.collection.find(options.query)
		    .skip(skipFrom)
			.limit(options.pageSize)
			.sort(options.sort)

		// process results
	  	cursor.toArray(function(err, docs) {
	    	if (err) {
	      		callback({'error': err});
	    	} else {
				cursor.count(function(err, count) {
					if (err) {
						callback(err, null);
					}else{
						var i = docs.length;
						while (i--) {
						    docs[i] = Utils.cleanDoc(docs[i]);
						}
				
						callback(null, {
							'items': docs,
							'count': count,
							'pageSize': options.pageSize,
							'page': options.page,
							'pageCount': Math.ceil(count / options.pageSize)
						});
					}
				});
	    	}
	  	});
	},


	// remove user from collection using id
	remove: function(options, callback){
		var self = this;
		this.collection.findAndRemove({'username': options.username}, function(err, doc) {
			if(!doc){
				callback(Boom.notFound('user not found', err), null);
			}else{
				// remove token for this user
				self.tokens.remove({owner : options.username}, function(){})
				callback(err, Utils.cleanDoc(doc));	
			}
		});
	},



	// remove all user from collection
	removeAll: function(callback){
		this.collection.remove({}, function(err, count) {

			callback(err, count);
		});
	}



};


exports.Users = Users;