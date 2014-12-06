'use strict';
var hapi        = require('hapi'),
    Joi         = require('joi'),
    handlers    = require('../lib/handlers.js'),
    routes,
        
routes =[{
	    method: 'GET',
	    path: '/hello',
	    handler: function (request, reply) {

	        reply('hello world');
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
	},]


exports.routes = routes;