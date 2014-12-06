'use strict';

var Fs				= require('fs'),
	Path            = require('path'),
	Hapi            = require('hapi'),
	Boom            = require('boom'),
	Joi            	= require('joi'),
	Bcrypt  		= require('bcrypt-nodejs'),
	Pack            = require('../package'),
	Bookmarks 		= require('./bookmarks').Bookmarks;


var bookmarks;

function init( db ){
	bookmarks = new Bookmarks( db );
}


function index(request, reply) {
	reply.view('index.html', {title: 'XXXXXXXXX'});

}

function getBookmark(request, reply) { 
	var options = {
			id: request.params.id
		};
	bookmarks.get( options, function( error, result ){
		renderJSON( request, reply, error, result );
	}); 
}


function getBookmarks(request, reply) { 
	var options = {
		query: {}
	};

	// add defaults for paging
	options.page = (request.query.page)? parseInt( request.query.page, 10 ) : 1;
	options.pageSize = (request.query.pagesize)? parseInt( request.query.pagesize, 10 ) : 20;

	bookmarks.find( options, function( error, result ){
		renderJSON( request, reply, error, result );
	}); 
}


function addBookmark (request, reply) { 
	var options = {item: {}};
	options.item = createBookmarkItem(request);

	bookmarks.add( options, function( error, result ){
		renderJSON( request, reply, error, result );
	}); 
}


function updateBookmark (request, reply) { 
	var options = {
		item: {},
		id: request.params.id
	};
	options.item = createBookmarkItem(request);

	bookmarks.update( options, function( error, result ){
		renderJSON( request, reply, error, result );
	}); 
}


// common function for add and update
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



function removeBookmark (request, reply) { 
	var options = {
			id: request.params.id
		};
	bookmarks.remove( options, function( error, result ){
		renderJSON( request, reply, error, result );
	}); 
}

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

	

exports.index = index;
exports.init = init;

exports.getBookmark = getBookmark;
exports.getBookmarks = getBookmarks;
exports.addBookmark = addBookmark;
exports.updateBookmark = updateBookmark;
exports.removeBookmark = removeBookmark;