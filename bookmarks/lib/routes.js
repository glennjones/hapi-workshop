'use strict';
var hapi        = require('hapi'),
    Joi         = require('joi'),
    handlers    = require('../lib/handlers.js'),
    routes;


function init( db ){
	handlers.init( db );
}


        
routes =[{
		method: 'GET',
		path: '/',
		config: {
			handler: handlers.index
		}
	},{
		method: 'GET',
		path: '/{path*}',
		handler: {
			directory: {
				path: './public',
				listing: false,
				index: true
			}
		}
	},{
		method: 'GET',
		path: '/bookmarks/{id}',
		config: {
			handler: handlers.getBookmark,
			description: 'Get bookmark',
			notes: ['Get a bookmark from the collection'],
			tags: ['api', 'public'],
			validate: { 
				params: {
					id: Joi.string()
						.required()
						.description('the id of the bookmark in the collection')
				}
			}
		}
	}, {
		method: 'GET',
		path: '/bookmarks/',
		config: {
			handler: handlers.getBookmarks,
			description: 'Get bookmarks',
			notes: ['Gets a list of bookmarks from the collection'],
			tags: ['api', 'public'],
			validate: { 
				query: {
					page: Joi.number()
						.description('the page number')
						.optional()
						.default(1)
						.min(0),

					pagesize: Joi.number()
						.description('the number of items to a page')
						.optional()
						.default(10)
						.min(0)
						.max(1000)
				}
			}
		}
	}, {
		method: 'POST',
		path: '/bookmarks/',
		config: {
			handler: handlers.addBookmark,
			description: 'Add bookmark',
			notes: ['Adds a bookmark to the collection'],
			tags: ['api', 'public'],
			validate: {
				headers: Joi.object({
						Authorization: Joi.string()
								.default('Bearer ')
								.description('bearer token takes "Bearer " and token'),
							}).unknown(),

				payload: {
					url: Joi.string()
						.required()
						.description('the url to bookmark'),

					title: Joi.string()
						.optional()
						.description('a title for the page'),

					tags: Joi.string()
						.optional()
						.description('a comma delimited list of tags'),

					description: Joi.string()
						.optional()
						.description('description for the page content')
				}
			}
		}
	}, {
		method: 'PUT',
		path: '/bookmarks/{id}',
		config: {
			handler: handlers.updateBookmark,
			description: 'Update bookmark',
			notes: ['Update a bookmark in the collection'],
			tags: ['api', 'public'],
			validate: {
				headers: Joi.object({
						Authorization: Joi.string()
								.default('Bearer ')
								.description('bearer token takes "Bearer " and token'),
							}).unknown(),

				params: {
					id: Joi.string()
						.required()
						.description('the id of the sum in the store')
				}, 
				payload: {
					url: Joi.string()
						.required()
						.description('the url to bookmark'),

					title: Joi.string()
						.optional()
						.description('a title for the page'),

					tags: Joi.string()
						.optional()
						.description('a comma delimited list of tags'),

					description: Joi.string()
						.optional()
						.description('description for the page content')
				}
			}
		}
	}, {
		method: 'DELETE',
		path: '/bookmarks/{id}',
		config: {
			handler: handlers.removeBookmark,
			description: 'Delete bookmark',
			notes: ['Deletes a bookmarks from the collection'],
			tags: ['api', 'public'],
			validate: {
				headers: Joi.object({
						Authorization: Joi.string()
								.default('Bearer ')
								.description('bearer token takes "Bearer " and token'),
							}).unknown(),

				params: {
					id: Joi.string()
						.required()
						.description('the id of the bookmark in the collection')
				}
			}
		}
	},]


exports.routes = routes;
exports.init = init;



