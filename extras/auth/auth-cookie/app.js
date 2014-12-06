

// Taken from https://github.com/tomsteele/hapi-auth-cookie-example

// Read
// https://blog.liftsecurity.io/2014/11/26/securing-hapi-client-side-sessions
// https://hacks.mozilla.org/2012/12/using-secure-client-side-sessions-to-build-simple-and-scalable-node-js-applications-a-node-js-holiday-season-part-3/


var Hapi = require('hapi');
var Dulcimer = require('dulcimer');
Dulcimer.connect('./test.db');

var User = new Dulcimer.Model({
    username: {
        type: 'String'
    },
    passwordHash: {
        type: 'String'
    },
    superToken: {
        type: 'integer'
    }
}, {
    name: 'user'
});

function validate(session, callback) {

    var foundUser = function (err, user) {

        // If we didn't find the user return isValid=false.
        if (err || !user) {
            return callback(null, false);
        }

        // Found the user, now make sure the superToken is
        // valid, if not, return isValid=false.
        if (session.superToken !== user.superToken) {
            return callback(null, false);
        }

        // Everything looks great, isValid=true, and pass
        // the user to upstream route handlers.
        return callback(null, true, user);
    };
    // Find the user by key.
    User.get(session.key, foundUser);
}


// Adds an account for testing.
function addUser() {

    User.wipe(function (err) {

        if (err) {
            process.exit(1);
        }

        var user = User.create({
            username: 'lifty',
            passwordHash: '$2a$10$N7NruJgfoe6p.OcpSxv/8OaJAFbC1pU/AyeOtM8trQwCTj8umJA4q', // password ;)
            superToken: Date.now()
        });

        user.save(function (err) {

            if (err) {
                process.exit(1);
            }

            console.log('user account created');
        });
    });
}

var server = new Hapi.Server('localhost', '8000');

server.pack.register(require('hapi-auth-cookie'), function (err) {

    addUser();

    server.auth.strategy('session', 'cookie', {
        password: 'a really long secret you generated using crypto',
        cookie: 'sid',
        redirectTo: '/login',
        isSecure: false,
        validateFunc: validate
    }, true);
    server.auth.default('session');

    server.route({
        path: '/login',
        method: ['GET', 'POST'],
        config: {
            auth: {
                mode: 'try',
            },
            plugins: {
                'hapi-auth-cookie': {
                    redirectTo: false
                }
            }
        },
        handler: function (request, reply) {

            if (request.auth.isAuthenticated) {
                return reply.redirect('/');
            }

            if (request.method === 'get') {
                return reply('<html><body><p>Submit to login</p><form action="/login" method="post"><input type="submit" /></form></body></html>');
            }

            // Grab the first user to simulate a login.
            User.all(function (err, user) {

                if (err) {
                    return reply(err).code(500);
                }

                request.auth.session.set({
                    key: user[0].key,
                    superToken: user[0].superToken
                });
                return reply.redirect('/');
            });
        }
    });

    server.route({
        path: '/',
        method: 'GET',
        handler: function (request, reply) {
            return reply('<html><body><p>Submit to revoke all sessions</p><form method="post" action="/revoke-sessions"><input type="submit" /></form></body></html>');
        }
    });

    server.route({
        path: '/revoke-sessions',
        method: 'POST',
        handler: function (request, reply) {
            var user = request.auth.credentials;
            user.superToken = Date.now();
            user.save(function (err) {

                if (err) {
                    return reply().code(500);
                }
                return reply.redirect('/');
            });
        }
    });

    console.log('Server listening on http://localhost:8000/');
    server.start();
});