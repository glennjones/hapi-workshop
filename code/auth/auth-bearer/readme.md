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
    var Hapi = require('hapi');
    
    var users = {
        jane: {
            id: 'jane',
            password: 'password',
            name: 'Jane Doe',
            
        }
    };
    
    var home = function (request, reply) {
    
        reply('<html><head><title>Login page</title></head><body><h3>Welcome '
          + request.auth.credentials.name
          + '!</h3><br/><form method="get" action="/logout">'
          + '<input type="submit" value="Logout">'
          + '</form></body></html>');
    };
    
    var login = function (request, reply) {
    
        if (request.auth.isAuthenticated) {
            return reply.redirect('/');
        }
    
        var message = '';
        var account = null;
    
        if (request.method === 'post') {
    
            if (!request.payload.username ||
                !request.payload.password) {
    
                message = 'Missing username or password';
            }
            else {
                account = users[request.payload.username];
                if (!account ||
                    account.password !== request.payload.password) {
    
                    message = 'Invalid username or password';
                }
            }
        }
    
        if (request.method === 'get' ||
            message) {
    
            return reply('<html><head><title>Login page</title></head><body>'
                + (message ? '<h3>' + message + '</h3><br/>' : '')
                + '<form method="post" action="/login">'
                + 'Username: <input type="text" name="username"><br>'
                + 'Password: <input type="password" name="password"><br/>'
                + '<input type="submit" value="Login"></form></body></html>');
        }
    
        request.auth.session.set(account);
        return reply.redirect('/');
    };
    
    var logout = function (request, reply) {
    
        request.auth.session.clear();
        return reply.redirect('/');
    };
    
    var server = new Hapi.Server('localhost', 8000);
    
    server.pack.register(require('hapi-auth-cookie'), function (err) {
    
        server.auth.strategy('session', 'cookie', {
            password: 'secret',
            cookie: 'sid-example',
            redirectTo: '/login',
            isSecure: false
        });
    
        server.route([
            {
                method: 'GET',
                path: '/',
                config: {
                    handler: home,
                    auth: 'session'
                }
            },
            {
                method: ['GET', 'POST'],
                path: '/login',
                config: {
                    handler: login,
                    auth: {
                        mode: 'try',
                        strategy: 'session'
                    },
                    plugins: {
                        'hapi-auth-cookie': {
                            redirectTo: false
                        }
                    }
                }
            },
            {
                method: 'GET',
                path: '/logout',
                config: {
                    handler: logout,
                    auth: 'session'
                }
            }
        ]);
    
        server.start();
    });

## Notes
The `bcrypt-nodejs` module (pure javascript version) was used in the example as its easier to install windows, but you may want to use `bcrypt` in production.

