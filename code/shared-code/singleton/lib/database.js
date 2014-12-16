
'use strict';
//  a shared database access layer

var Url       = require('url'),
    Mongodb   = require('mongodb'),
    Joi       = require('joi'),
    Hoek      = require('hoek');


var connectionInstance = null,
    connectionInfo = null,
    callbacks = [],
    optionsSchema;


// simple schema for options
// http://mongodb.github.io/node-mongodb-native/1.4/driver-articles/mongoclient.html#mongoclient-connect
optionsSchema = Joi.object().keys({
  url: Joi.string().required(),
  settings: Joi.object().keys({
    db: Joi.object().optional(),
    server: Joi.object().optional(),
    replSet: Joi.object().optional(),
    mongos: Joi.object().optional()
  }).optional()
}).required();



module.exports =  {

   connect: function(options, callback) {

      // if already we have a connection return it
      if (connectionInstance) {
        callback(null, connectionInstance);
      }else{

        // is the passed options object valid
        optionsSchema.validate(options, function (err, options) {

          if(err){
            callback(err, null);
          }else{

            // add default settings.server.auto_reconnect = true, to force db reconnect when needed
            var defaults = {
                  'settings': {
                    'server': {
                      'auto_reconnect': true
                    }
                  }
                };
            options = Hoek.applyToDefaults(defaults, options);

            // stop racing condition by collecting callbacks while connection is made
            callbacks.push(callback);

            // on first callback start the connection process
            if(callbacks.length === 1){
            
              // create a database connection;
              Mongodb.MongoClient.connect(options.url, options.settings, function (err, databaseConnection) {
                if (!err) {
                  connectionInstance = databaseConnection;
                  connectionInfo = parseConnectionInfo(options);
                  console.log('mongodb database connected:', options.url)
                }

                // loop callbacks
                callbacks.forEach(function(callback){
                  callback(err, connectionInstance);
                });
                callbacks = [];
              });
            }


          }

      });  
      } 
    },


  // release mongodb connection
  disconnect: function(callback){
    Mongodb.MongoClient.close(function (err, result) {
      connectionInstance = null;
      connectionInfo = null;
      callback(err, result);
    });
  },


  // return the current connect mongodb settings
  getConnectionInfo: function(){
    return connectionInfo;
  }

}



// builds the current connect mongodb info object
function parseConnectionInfo(options){
  var out = {},
      parsedUrl = Url.parse(options.url);

  if(parsedUrl){
    out = {
      url:      options.url,
      host:     parsedUrl.hostname,
      port:     parseInt(parsedUrl.port, 10),
      name:     parsedUrl.pathname.substr(1),
      user:     parsedUrl.auth ? parsedUrl.auth.split(':')[0] : null,
      password: parsedUrl.auth ? parsedUrl.auth.split(':')[1] : null
    }
    if(options.settings){
      out.settings = options.settings
    }
  }
  return out;
}



