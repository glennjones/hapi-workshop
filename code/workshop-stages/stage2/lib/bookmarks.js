
'use strict';
//	data access layer for bookmarks

var Url 		= require('url'),
	Hoek 		= require('hoek'),
	Boom 		= require('boom'),
	ShortId 	= require('shortid'),
	Utils 		= require('../lib/utilities.js');
	

function Bookmarks (db) {
	var self = this;
	this.db = db;
	this.collection = this.db.collection('bookmarks');
}



Bookmarks.prototype = {

	// adds a new bookmark
	add: function (options, callback){
		var url;
		options.item.id = ShortId.generate();
		options.item.created = new Date();
		options.item.modified = new Date();

		// validate string url using node lib
		url = Url.parse(options.item.url)
		if( url ){

			options.item.host = url.host;
			this.collection.insert(options.item, { safe: true }, function (err, doc) {
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



	// update an existing bookmark
	update: function (options, callback){
		var self = this;

		this.get(options, function(err, doc){
			if(doc){

				// explicit property update
				doc.url = options.item.url;
				doc.title = options.item.title;
				doc.tags = options.item.tags;
				doc.description = options.item.description;

				// update modified timestamp
				doc.modified = new Date();

				// save changes
				self.collection.update( {'id': options.id}, doc, function(err, count){
					if(!count || count === 0){
						callback(Boom.notFound('Bookmark not found', err), null);
					}else{
						self.get(options, callback);
					}
				});

			}else{
				callback(Boom.notFound('Bookmark not found'), null);
			}
		});
	},



	// get a single bookmark
	get: function(options, callback){
		this.collection.findOne( {'id': options.id}, function(err, doc){
			if(doc){
				callback(null, Utils.cleanDoc(doc));
			}else{
				callback(Boom.notFound('Bookmark not found'), null);
			}
		});
	},



	// find a list of bookmark that match a query
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


	// remove bookmark from collection using id
	remove: function(options, callback){
		this.collection.findAndRemove({'id': options.id}, function(err, doc) {
			if(!doc){
				callback(Boom.notFound('Bookmark not found', err), null);
			}else{
				callback(err, Utils.cleanDoc(doc));	
			}
		});
	},



	// remove all bookmark from collection
	removeAll: function(callback){
		this.collection.remove({}, function(err, count) {
			console.log(err, count)
			callback(err, count);
		});
	}



};


exports.Bookmarks = Bookmarks;