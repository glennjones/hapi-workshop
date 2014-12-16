'use strict';

var Fs				= require('fs'),
	Path            = require('path'),
	Hapi            = require('hapi'),
	Boom            = require('boom'),
	Joi            	= require('joi'),
	Bcrypt  		= require('bcrypt-nodejs'),
	Users      		= require('../lib/users.js'),
    Tokens      	= require('../lib/tokens.js'),
    Bookmarks      	= require('../lib/bookmarks.js'),
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


function admin(request, reply) {
	var out = {
		title: Pack.name + ' &dash; Admin',
	}

	// get user date from auth credentials
	if(request.auth && request.auth.credentials && request.auth.credentials.user){
		out.user = request.auth.credentials.user;
		out.strategy = request.auth.strategy
	}
	console.log(out)

	if(out.user.groups && out.user.groups.indexOf('admin') > -1){
		reply.view('admin.html', out);
	}else{
		reply(Boom.unauthorized(['unauthorized access to admin'], [request.auth.strategy]));
	}
	
}


function token(request, reply) {
	if (!request.auth.isAuthenticated) {
        reply(Boom.unauthorized(['unauthorized access to tokens'], [request.auth.strategy]));
    }else{
    	if(request.auth && 
    		request.auth.credentials && 
    		request.auth.credentials.user){
			Tokens.get({owner: request.auth.credentials.user.username}, function(err, token){
				renderJSON( request, reply, err, {
					access_token: token.accessToken,
					expires_in: token.expires,
					token_type: 'Bearer'
				});
			})
		}else{
			reply(Boom.notFound(['token not found for user']));
		}
    }
}


function logon(request, reply) {
	var message = null,
		account = null;

	// already logon
	if (request.auth.isAuthenticated) {
        return reply.redirect('/');
    }

	if (request.method === 'post') {
        if (!request.payload.username || !request.payload.password) {
            message = 'Missing username or password';
        }
        else {
			if(!message){
			    Users.get({username: request.payload.username}, function(err, user){
			    	if(err){
			    		message = 'Invalid username or password';
			    		displayForm(message)
			    	}else{
				    	Bcrypt.compare(request.payload.password, user.password, function (err, isValid) {
					        if(!err && isValid){
					        	request.auth.session.set({
							        username: user.username,
							        name: user.name,
							        hash: user.password, // this is the oneway hash
							        revokeToken: user.revokeToken,
							        groups: user.groups
							    });
							    return reply.redirect('/');
					        }else{
					        	message = 'Invalid username or password';
					        	displayForm(message)
					        }
					    }); 	
			    	}

			    })
			}
        }
    }

    // either get or an error on post
    if (request.method === 'get' || message) {
    	displayForm(message)
    }

    function displayForm(message){
    	var out = {message: message}
        reply.view('logon.html', out);
    }
}



function logout(request, reply) {
	request.auth.session.clear();
    return reply.redirect('/');
}


function register(request, reply) {
	var message = null,
		account = null;

	// already logon
	if (request.auth.isAuthenticated) {
        return reply.redirect('/');
    }

	if (request.method === 'post') {

        var schema = Joi.object().keys({
        	name: Joi.string().min(1).max(40).required(),
    		username: Joi.string().alphanum().min(3).max(30).required(),
    		password: Joi.string().regex(/[a-zA-Z0-9]{8,30}/).required(),
    		email: Joi.string().email().required()
		})

        Joi.validate(request.payload, schema, function (err, value) {
        	if(err){
        		displayForm(err.message);
        	}else{
		        Users.add({item: value},function(err, user){
		        	if(err || !user){
		        		message = 'Unable to create new user: ' + err
		        		displayForm(message);	
		        	}else{
		        		return reply.redirect('/logon');
		        	}
		        });
        	}
		});
    }

    // either get or an error on post
    if (request.method === 'get' || message) {
    	displayForm(message)
    }

    function displayForm(message){
    	var out = {message: message}
        reply.view('register.html', out);
    }
}



/* ----------------------------------------------------------------------------------- */



function getBookmark(request, reply) { 
	var options = {
			id: request.params.id
		};
	Bookmarks.get( options, function( error, result ){
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

	Bookmarks.find( options, function( error, result ){
		renderJSON( request, reply, error, result );
	}); 
}


function addBookmark (request, reply) { 
	var options = {item: {}};
	options.item = createBookmarkItem(request);

	Bookmarks.add( options, function( error, result ){
		renderJSON( request, reply, error, result );
	}); 
}


function updateBookmark (request, reply) { 
	var options = {
		item: {},
		id: request.params.id
	};
	options.item = createBookmarkItem(request);

	Bookmarks.update( options, function( error, result ){
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
	Bookmarks.remove( options, function( error, result ){
		renderJSON( request, reply, error, result );
	}); 
}


/* ----------------------------------------------------------------------------------- */



function getUser(request, reply) { 
	var options = {
			username: request.params.username
		};
	Users.get( options, function( error, result ){
		renderJSON( request, reply, error, result );
	}); 
}


function getUsers(request, reply) { 
	var options = {
		query: {}
	};

	// add defaults for paging
	options.page = (request.query.page)? parseInt( request.query.page, 10 ) : 1;
	options.pageSize = (request.query.pagesize)? parseInt( request.query.pagesize, 10 ) : 20;

	Users.find( options, function( error, result ){
		renderJSON( request, reply, error, result );
	}); 
}


function addUser (request, reply) { 
	var options = {item: {}};
	options.item = createUserItem(request);

	Users.add( options, function( error, result ){
		renderJSON( request, reply, error, result );
	}); 
}


function updateUser (request, reply) { 
	var options = {
		item: {},
		username: request.params.username
	};
	options.item = createUserItem(request);

	Users.update( options, function( error, result ){
		renderJSON( request, reply, error, result );
	}); 
}


// common function for add and update
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



function removeUser (request, reply) { 
	var options = {
			username: request.params.username
		};
	Users.remove( options, function( error, result ){
		renderJSON( request, reply, error, result );
	}); 
}


/* ----------------------------------------------------------------------------------- */



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


/* ----------------------------------------------------------------------------------- */


exports.index = index;
exports.admin = admin;
exports.token = token;
exports.logon = logon;
exports.logout = logout;
exports.register = register;

exports.getBookmark = getBookmark;
exports.getBookmarks = getBookmarks;
exports.addBookmark = addBookmark;
exports.updateBookmark = updateBookmark;
exports.removeBookmark = removeBookmark;

exports.getUser = getUser;
exports.getUsers = getUsers;
exports.addUser = addUser;
exports.updateUser = updateUser;
exports.removeUser = removeUser;






