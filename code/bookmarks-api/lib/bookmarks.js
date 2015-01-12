'use strict';
//	data access layer for bookmarks

var Url			= require('url'),
	Hoek		= require('hoek'),
	Boom		= require('boom'),
	ShortId		= require('shortid'),
	Config		= require('./config-manager.js'),
	Database	= require('./database.js'),
	Utils		= require('./utilities.js');


var dbOptions = {
	'url': Config.database.url
};


module.exports = {

	// adds a new bookmark
	add: function(options, callback) {
		var self = this;
		Database.connect(dbOptions, function(err, db) {
			if (err || !db) {
				callback(Boom.badImplementation('Failed to connect to db', err), null);
			} else {
				var url;

				options.item.id = ShortId.generate();
				options.item.created = new Date();
				options.item.modified = new Date();

				// validate string url using node lib
				url = Url.parse(options.item.url);
				if (url) {

					options.item.host = url.host;
					db.collection('bookmarks').insert(options.item, {
						safe: true
					}, function(err, docs) {
						if (err || !docs) {
							callback(Boom.badImplementation('Failed to add bookmark to db', err), null);
						} else {
							callback(null, docs[0]);
						}
					});

				} else {
					callback(Boom.badRequest('Url was not parsable'), null);
				}
			}
		});
	},



	// update an existing bookmark
	update: function(options, callback) {
		var self = this;
		Database.connect(dbOptions, function(err, db) {
			if (err || !db) {
				callback(Boom.badImplementation('Failed to connect to db', err), null);
			} else {

				self.get(options, function(err, doc) {
					if (doc) {

						// explicit property update
						doc.url = options.item.url;
						doc.title = options.item.title;
						doc.tags = options.item.tags;
						doc.description = options.item.description;

						// update modified timestamp
						doc.modified = new Date();

						// save changes
						db.collection('bookmarks').update({
							'id': options.id
						}, doc, function(err, count) {
							if (!count || count === 0) {
								callback(Boom.notFound('Bookmark not found', err), null);
							} else {
								self.get(options, callback);
							}
						});

					} else {
						callback(Boom.notFound('Bookmark not found'), null);
					}
				});
			}
		});
	},



	// get a single bookmark
	get: function(options, callback) {
		Database.connect(dbOptions, function(err, db) {
			if (err || !db) {
				callback(Boom.badImplementation('Failed to connect to db', err), null);
			} else {
				db.collection('bookmarks').findOne({
					'id': options.id
				}, function(err, doc) {
					if (doc) {
						callback(null, doc);
					} else {
						callback(Boom.notFound('Bookmark not found'), null);
					}
				});
			}
		});
	},



	// find a list of bookmark that match a query
	find: function(options, callback) {
		var cursor,
			defaults,
			skipFrom,
			self = this;

		defaults = {
			page: 1,
			pageSize: 10,
			sort: {
				modified: -1
			},
			query: {}
		};

		options = Hoek.applyToDefaults(defaults, options);
		skipFrom = (options.page * options.pageSize) - options.pageSize;


		Database.connect(dbOptions, function(err, db) {
			if (err || !db) {
				callback(Boom.badImplementation('Failed to connect to db', err), null);
			} else {
				// create and fire query
				cursor = db.collection('bookmarks').find(options.query)
					.skip(skipFrom)
					.limit(options.pageSize)
					.sort(options.sort);

				// process results
				cursor.toArray(function(err, docs) {
					if (err) {
						callback({
							'error': err
						});
					} else {
						cursor.count(function(err, count) {
							if (err) {
								callback(err, null);
							} else {
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
			}
		});
	},


	// remove bookmark from collection using id
	remove: function(options, callback) {
		Database.connect(dbOptions, function(err, db) {
			if (err || !db) {
				callback(Boom.badImplementation('Failed to connect to db', err), null);
			} else {
				db.collection('bookmarks').findAndRemove({
					'id': options.id
				}, function(err, doc) {
					if (!doc) {
						callback(Boom.notFound('Bookmark not found', err), null);
					} else {
						callback(err, doc);
					}
				});
			}
		});
	},



	// remove all bookmark from collection
	removeAll: function(callback) {
		Database.connect(dbOptions, function(err, db) {
			if (err || !db) {
				callback(Boom.badImplementation('Failed to connect to db', err), null);
			} else {
				db.collection('bookmarks').remove({}, function(err, count) {
					callback(err, count);
				});
			}
		});
	}



};