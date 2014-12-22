'use strict';
var hapi        = require('hapi'),
	Joi 		= require('joi'),
	handlers    = require('../lib/handlers.js'),
	routes;



module.exports = [{
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
	}, {
		method: 'POST',
		path: '/bookmarks/',
		config: {
			handler: handlers.addBookmark,
			description: 'Add bookmark',
			notes: ['Adds a bookmark to the collection'],
			tags: ['api'],
			validate: {
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
	},{
		method: 'POST',
		path: '/users/',
		config: {
			handler: handlers.addUser,
			description: 'Add user',
			notes: ['Adds a user to the collection'],
			tags: ['api'],
			validate: {
				payload: {
					username: Joi.string()
						.description('3-30 letters or numbers')
						.required()
						.alphanum()
						.min(3)
						.max(30),

		        	name: Joi.string()
		        		.description('users full name 1-40 chars')
			        	.required()
			        	.min(1)
			        	.max(40),

		  			email: Joi.string()
		  				.description('users email address')
			  			.required()
			  			.email(),

		    		password: Joi.string()
		    			.description('8+ letters or numbers')
			    		.required()
			    		.regex(/[a-zA-Z0-9]{8,30}/),
		    		
					groups: Joi.string()
						.description('comma delimited list of groups: user, admin')
						.default('user')
			    		.required()
				}
			}
		}
	}]






