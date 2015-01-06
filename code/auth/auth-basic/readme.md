# Basic Authentication Example

This is a simple example of using [HTTP basic authentication](http://en.wikipedia.org/wiki/Basic_access_authentication) strategy with [hapi.js](http://hapijs.com/). It uses the [hapi-auth-basic](https://github.com/hapijs/hapi-auth-basic) plug-in

## Run
1. Download this project
2. Open a console and cd into the project directory `$ cd hapi-workshop\code\auth\basic`
3. Run `$ npm install`
4. Run `$ node app`
5. Connect to the server using `http://localhost:8000`

## Using the example
The username is `jane` and the password is `password`. If you wish to reset the basic authentication you can use the URL `http://log:out@localhost:8000`. 

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
    
    
    // Create hash for string 'password'
    /*Bcrypt.hash('password', null, null, function (err, hash) {
      console.log(err, hash);
    });*/
    
    // Create a validation function for strategy
    var validate = function (username, password, callback) {
        var user = users[username];
        if (!user) {
            return callback(null, false);
        }
        Bcrypt.compare(password, user.password, function (err, isValid) {
            callback(err, isValid, { id: user.id, name: user.name });
        });
    };
    
    
    // Create a server with a host and port
    var server = new Hapi.Server('localhost', 8000);
    
    
    // Add the basic-auth plug-in
    server.pack.register(require('hapi-auth-basic'), function (err) {
        server.auth.strategy('simple', 'basic', { validateFunc: validate });
    });
    
    
    // Add a simple route
    server.route({ 
        method: 'GET', 
        path: '/', 
        config: { auth: 'simple' },
        handler: function (request, reply) {
            var name = request.auth.credentials.name
            reply('hello ' + name);
        } 
    });
    
    server.start();
    
## Notes
The `bcrypt-nodejs` module (pure javascript version) was used in the example as its easier to install windows, but you may want to use `bcrypt` in production.
