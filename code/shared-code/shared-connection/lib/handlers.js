'use strict';

var Fs				= require('fs'),
	Path            = require('path'),
	Hapi            = require('hapi'),
	Boom            = require('boom'),
	Joi            	= require('joi'),
	Bookmarks 		= require('../lib/bookmarks.js'),
	Users 			= require('../lib/users.js'),
	Utils           = require('../lib/utilities.js'),
	Pack            = require('../package');



function index(request, reply) {
	Utils.getMarkDownHTML(__dirname.replace('/lib','') + '/readme.md', function(err, data){
		var out = {
			title: Pack.name,
			markdown: data
		}

		// get user date from session state
		if(request.state.sid && request.state.sid.username){
			out.user = {
				name: request.state.sid.name,
				username: request.state.sid.username,
				groups: request.state.sid.groups
			};
			out.strategy = 'cookie'
		}

		reply.view('index.html', out);
	});
}




// examples of indirect use of hapi-mongodb plug-in
// where connection is passed into data access layer
// ------------------------------------------------------

function addBookmark (request, reply) { 
	var options = {item: {}};
	options.item = createBookmarkItem(request);

	Bookmarks.add( options, function( err, result ){
		renderJSON( request, reply, err, result );
	}); 
}


function addUser (request, reply) { 
	var options = {item: {}};
	options.item = createUserItem(request);

	Users.add( options, function( err, result ){
		renderJSON( request, reply, err, result );
	}); 
}



// share function for crud based handlers
// ------------------------------------------------------


// render json out to http stream
function renderJSON( request, reply, err, result ){
	if(err){
		if( Utils.isString( err ) ){
			// error without a code are returned as 500
			reply( Boom.badImplementation(err) );
		}else{
			reply( err );
		}
	}else{
		reply(result).type('application/json; charset=utf-8');
	}
}


function createBookmarkItem(request){
	var item = {}

	if(request.payload){
		item = request.payload;
	}
	
	if(request.query.url){
		item = {
			url: request.query.url,
			title: request.query.title,
			tags: request.query.tags,
			description: request.query.description
		};
	}
	// turn tag string into an array
	if(Utils.isString(item.tags)){
		if(item.tags.indexOf(',') > -1){
			item.tags = Utils.trimItemsOfArray(item.tags.split(',')) ;
		}else{
			item.tags = [Utils.trim(item.tags)];
		}
	}
	return item;
}



function createUserItem(request){
	var item = {}

	if(request.payload){
		item = request.payload;
	}
	
	if(request.query.username){
		item = {
			username: request.query.username,
			name: request.query.name,
			email: request.query.email,
			password: request.query.password
		};
	}
	// turn groups string into an array
	if(Utils.isString(item.groups)){
		if(item.groups.indexOf(',') > -1){
			item.groups = Utils.trimItemsOfArray(item.groups.split(',')) ;
		}else{
			item.groups = [Utils.trim(item.groups)];
		}
	}
	return item;
}




exports.index = index;
exports.addBookmark = addBookmark;
exports.addUser = addUser;







