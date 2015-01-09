# Mixed Authentication Example

This is a small example of using a mixed authentication strategy with [hapi.js](http://hapijs.com/). The example creates access control either through HTTP Basic or using a Bearer Token. The two plugins used to provide the authentication straties are:

* [hapi-auth-basic](https://github.com/hapijs/hapi-auth-basic) 
* [hapi-auth-bearer-token](https://github.com/johnbrett/hapi-auth-bearer-token) 

## Run
1. Download this project
2. Open a console and cd into the project directory `$ cd hapi-workshop\code\auth\auth-mixed`
3. Run `$ npm install`
4. Run `$ node app`
5. Connect to the server using `http://localhost:8000`

## Using the example
The token is `d294b4b6-4d65-4ed8-808e-26954168ff48`. The token can be passed as querystring or a header. Try the URL: http://localhost:8000/?access_token=d294b4b6-4d65-4ed8-808e-26954168ff48. 

To access the content with basic authentication use the URL http://localhost:8000/basic with the username `jane` and the password is `password`. Once you are logged on return the root http://localhost:8000 To remove the basic authentication use the URLs `http://log:out@localhost:8000` and `http://log:out@localhost:8000/basic`


## Code
var Hapi    = require('hapi'),
    Bcrypt  = require('bcrypt-nodejs');


// Create a in memory collections of users
var users = {
    jane: {
        username: 'jane',
        password: '$2a$10$XPk.7lupEzBSHxUg/IavSuIKmwmpBbW0NfCL8q0ZfHXUPXTtbhmNK',   // 'password'
        name: 'Jane Doe',
        id: '2133d32a'
    }
};



// Create a validation function for strategy
var validateBasic = function (username, password, callback) {
    var user = users[username];
    if (!user) {
        return callback(null, false);
    }
    Bcrypt.compare(password, user.password, function (err, isValid) {
        callback(err, isValid, { id: user.id, name: user.name });
    });
};



// Create a validation function for strategy
var validateBearer = function (token, callback) {
    if(token === "d294b4b6-4d65-4ed8-808e-26954168ff48"){
        callback(null, true, { token: token })
    } else {
        callback(null, false)
    }
};


// Create a server with a host and port
var server = new Hapi.Server();
server.connection({ 
    host: 'localhost', 
    port: 8000 
});



// Add the basic-auth plug-in
server.register(require('hapi-auth-basic'), function (err) {
    server.auth.strategy('basic', 'basic', { 
        validateFunc: validateBasic 
    });
});


// Add the bearer-auth plug-in
server.register(require('hapi-auth-bearer-token'), function (err) {
    server.auth.strategy('bearer', 'bearer-access-token', {
        allowMultipleHeaders: true,
        validateFunc: validateBearer
    });
});


// Add a simple route
server.route([{ 
        method: 'GET', 
        path: '/', 
        config: {
            cors: true,
            jsonp: 'callback', 
            auth: {
                strategies:['basic','bearer']
            }
        },
        handler: function (request, reply) {

            var name = '';

            if(request.auth.credentials){
                if(request.auth.credentials.token){
                  name = request.auth.credentials.token  
                }
                if(request.auth.credentials.name){
                  name = request.auth.credentials.name  
                }

                reply( '{"hello": "' + name +'"}' ).type('application/json');

            }else{
                reply( '{"hello": "Not authenticated"}' ).type('application/json');
            }
        } 
    },{ 
        method: 'GET', 
        path: '/basic', 
        config: {
            auth: {
                strategies:['basic']
            }
        },
        handler: function (request, reply) {
            var name = request.auth.credentials.name
            reply('hello ' + name);
        } 
    }]);

server.start();



## Notes
The `bcrypt-nodejs` module (pure javascript version) was used in the example as its easier to install windows, but you may want to use `bcrypt` in production.

