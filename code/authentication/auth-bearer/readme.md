# Cookie Authentication Example

This is a small example of using a Cookie authentication strategy with [hapi.js](http://hapijs.com/). It uses the [hapi-auth-cookie/](https://github.com/hapijs/hapi-auth-cookie/) plug-in

## Run
1. Download this project
2. Open a console and cd into the project directory `$ cd hapi-workshop\code\auth\auth-cookie`
3. Run `$ npm install`
4. Run `$ node app`
5. Connect to the server using `http://localhost:8000`

## Using the example
To access the content with cookie authentication use the form with username `jane` and the password  `password`.

## Code
    var Hapi    = require('hapi');


    // Create a validation function for strategy
    var validate = function (token, callback) {
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


    // Add the bearer-auth plug-in
    server.register(require('hapi-auth-bearer-token'), function (err) {
        server.auth.strategy('bearer', 'bearer-access-token', {
            validateFunc: validate
        });
    });


    // Add a simple route
    server.route({ 
        method: 'GET', 
        path: '/', 
        config: { 
            cors: true,
            jsonp: 'callback',
            auth: {strategies:['bearer']}
        },
        handler: function (request, reply) {
            var token = request.auth.credentials.token
            reply( '{"hello": "' + token +'"}' )
                .type('application/json');
        } 
    });

    server.start();




## Notes
The `bcrypt-nodejs` module (pure javascript version) was used in the example as its easier to install windows, but you may want to use `bcrypt` in production.

