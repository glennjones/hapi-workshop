var Hapi = require('hapi')
  , Joi = require('joi');

var server = new Hapi.Server(process.env.PORT || 3000, {
  validation: {
    stripUnknown: true,
    abortEarly: false
  },
  cors: true
});

var docsOptions = {
  basePath: 'http://localhost:3000',
  apiVersion: require('./package.json').version,
  payloadType: 'json'
};

var plugins = [{
  plugin: require('hapi-swagger'), options: docsOptions
}];

server.pack.register(plugins, function (err) {
  if (err) {
    throw err;
  }
});

var handler = function(request, reply) {
  console.log('OK');
  reply();
};

var Person = Joi.object({
  ssn: Joi.string().required()
});

var CreatePerson = Person.keys({
  password: Joi.string().required()
});

var UpdatePerson = Person.keys({
  password: Joi.string()
});

Joi.validate({ ssn: '1234' }, CreatePerson, function (err, value) {
  console.log('CreatePerson', err, value);
});

Joi.validate({ ssn: '1234' }, UpdatePerson, function (err, value) {
  console.log('UpdatePerson', err, value);
});

server.route([
  {
    method: 'POST',
    path: '/person',
    config: {
      handler: handler,
      tags: ['api'],
      validate: {
        payload: {
           ssn: Joi.string().required(),
           password: Joi.string().required()
        }
      }
    }
  },{
    method: 'PUT',
    path: '/person',
    config: {
      handler: handler,
      tags: ['api'],
      validate: {
        payload: {
           ssn: Joi.string().required(),
           password: Joi.string()
        }
      }
    }
  },{
    method: 'PUT',
    path: '/students',
    config: {
      handler: handler,
      tags: ['api'],
      validate: {
         payload: {
          students: Joi.array()
                    .required()
                    .min(1)
                    .includes(Joi.object().keys({
                        url: Joi.string().required(),
                        settings: Joi.object().keys({
                          db: Joi.object().optional(),
                          server: Joi.object().optional(),
                          replSet: Joi.object().optional(),
                          mongos: Joi.object().optional()
                        }).optional()
                    }))
        }
      }
    }
  }
]);

if (!module.parent) {
  server.start(function () {
    console.log('info', 'Server running at: ' + server.info.uri);
  });
}

module.exports = server;