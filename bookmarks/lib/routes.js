'use strict';
var hapi        = require('hapi'),
	Joi 		= require('joi'),
	handlers    = require('../lib/handlers.js'),
	routes,
	standardHTTPErrors,
	extendedHTTPErrors;


function init( db ){
	handlers.init( db );
}


standardHTTPErrors = [
	{ code: 400, message: 'Bad Request' },
	{ code: 500, message: 'Internal Server Error'}
];

extendedHTTPErrors = [
	{ code: 400, message: 'Bad Request' },
	{ code: 404, message: 'Not Found' },
	{ code: 500, message: 'Internal Server Error'}
];



routes = [{
		method: 'GET',
		path: '/',
		config: {
			handler: handlers.index
		}
	},{
		method: 'GET',
		path: '/admin',
		config: {
			auth: {strategies:['cookie']}, 
			handler: handlers.admin
		}
	},{
	    method: 'GET',
	    path: '/token',
	    config: {
	        handler: handlers.token,
 			auth: {
                strategy: 'basic', 
            }
	    }
	},{
	    method: ['GET','POST'],
	    path: '/logon',
	    config: {
	        handler: handlers.logon,
 			auth: {
                mode: 'try',
                strategy: 'cookie'
            },
	        plugins: {
	            'hapi-auth-cookie': {
	                redirectTo: false
	            }
	        }
	    }
	},{
		method: 'GET',
		path: '/logout',
		config: {
			handler: handlers.logout
		}
	},{
	    method: ['GET','POST'],
	    path: '/register',
	    config: {
	        handler: handlers.register
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
			plugins: {
				'hapi-swagger': {
					responseMessages: extendedHTTPErrors
				}
			},
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
			plugins: {
				'hapi-swagger': {
					responseMessages: standardHTTPErrors
				}
			},
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
			plugins: {
				'hapi-swagger': {
					responseMessages: standardHTTPErrors,
					payloadType: 'form'
				}
			},
			tags: ['api', 'public'],
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
	}, {
		method: 'PUT',
		path: '/bookmarks/{id}',
		config: {
			handler: handlers.updateBookmark,
			description: 'Update bookmark',
			notes: ['Update a bookmark in the collection'],
			plugins: {
				'hapi-swagger': {
					responseMessages: extendedHTTPErrors,
					payloadType: 'form'
				}
			},
			tags: ['api', 'public'],
			validate: {
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
			plugins: {
				'hapi-swagger': {
					responseMessages: extendedHTTPErrors
				}
			},
			tags: ['api', 'public'],
			validate: { 
				params: {
					id: Joi.string()
						.required()
						.description('the id of the bookmark in the collection')
				}
			}
		}
	},{
		method: 'GET',
		path: '/users/{username}',
		config: {
			handler: handlers.getUser,
			description: 'Get user',
			notes: ['Get a user from the collection'],
			plugins: {
				'hapi-swagger': {
					responseMessages: extendedHTTPErrors
				}
			},
			tags: ['api', 'private'],
			validate: { 
				params: {
					username: Joi.string()
						.required()
						.description('the username of the users in the collection')
				}
			}
		}
	}, {
		method: 'GET',
		path: '/users/',
		config: {
			handler: handlers.getUsers,
			description: 'Get users',
			notes: ['Gets a list of users from the collection'],
			plugins: {
				'hapi-swagger': {
					responseMessages: standardHTTPErrors
				}
			},
			tags: ['api', 'private'],
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
		path: '/users/',
		config: {
			handler: handlers.addUser,
			description: 'Add user',
			notes: ['Adds a user to the collection'],
			plugins: {
				'hapi-swagger': {
					responseMessages: standardHTTPErrors,
					payloadType: 'form'
				}
			},
			tags: ['api', 'private'],
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
	}, {
		method: 'PUT',
		path: '/users/{username}',
		config: {
			handler: handlers.updateUser,
			description: 'Update user',
			notes: ['Update a user in the collection'],
			plugins: {
				'hapi-swagger': {
					responseMessages: extendedHTTPErrors,
					payloadType: 'form'
				}
			},
			tags: ['api', 'private'],
			validate: {
				params: {
					username: Joi.string()
						.required()
						.description('the users username')
						.required()
						.alphanum()
						.min(3)
						.max(30),
				}, 
				payload: {
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
	}, {
		method: 'DELETE',
		path: '/users/{username}',
		config: {
			handler: handlers.removeUser,
			description: 'Delete user',
			notes: ['Deletes a user from the collection'],
			plugins: {
				'hapi-swagger': {
					responseMessages: extendedHTTPErrors
				}
			},
			tags: ['api', 'private'],
			validate: { 
				params: {
					username: Joi.string()
						.required()
						.description('the username of the user in the collection')
				}
			}
		}
	},]


exports.init = init;
exports.routes = routes;



