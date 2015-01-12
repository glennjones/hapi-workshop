# Good logging example

This is a simple example of console logging request data. It uses the [good](https://github.com/hapijs/good) and [good-console](https://github.com/hapijs/good-console) plug-ins.

## Run
1. Download this project
2. Open a console and cd into the project directory `$ cd hapi-workshop\code\log\good`
3. Run `$ npm install`
4. Run `$ node app`
5. Connect to the server using `http://localhost:8000`

## Using the example
When you view any URL such as `http://localhost:8000` or `http://localhost:8000/404error` the resulting request data will be logged into the console.   

## Code
    var Hapi    = require('hapi')
    
    
    // Create a server with a host and port
    var server = new Hapi.Server();
    server.connection({ 
        host: 'localhost', 
        port: 8000 
    });
    
    
    // Add a simple route
    server.route({ 
        method: 'GET', 
        path: '/', 
        handler: function (request, reply) {
            reply('hello');
        } 
    });
    
    
    
    var goodOptions = {
        opsInterval: 1000,
        reporters: [{
            reporter: require('good-console'),
            args:[{ log: '*', response: '*' }]
        }]
    };
    
    
    // Register plug-in and start
    server.register({
        register: require('good'),
        options: goodOptions
    }, function (err) {
        if (err) {
            console.error(err);
        }else {
            server.start(function () {
                console.info('Server started at ' + server.info.uri);
            });
        }
    });




