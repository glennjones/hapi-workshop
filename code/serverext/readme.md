# `server.ext` Example

This is a simple example of using `server.ext` `onPreResponse` event to show how to add headers into all your requests. 

## Run
1. Download this project
2. Open a console and cd into the project directory `$ cd hapi-workshop\code\serverext`
3. Run `$ npm install`
4. Run `$ node app`
5. Connect to the server using `http://localhost:8000`

## Using the example
When you view the URL `http://localhost:8000` use the browsers inspector options to view the response headers.   

## Code
    var Hapi    = require('hapi'),
        Pack    = require('./package');


    // Create a server with a host and port
    var server = new Hapi.Server();
    server.connection({ 
        host: 'localhost', 
        port: 8000 
    });


    server.ext('onPreResponse', function(request, reply) {
        request.response.header('X-API-VERSION', Pack.version);
        return reply.continue();
    });


    server.ext('onPreResponse', function(request, reply) {
        request.response.header('X-API-LICENSE', Pack.license);
        return reply.continue();
    });


    // Add a simple route
    server.route({ 
        method: 'GET', 
        path: '/', 
        handler: function (request, reply) {
            reply('Please inspect the headers of this response');
        } 
    });


    server.start();





