'use strict';
// a config manager
// uses both config.js file and process.env properties 
// example process.env naming: process.env.DATABASE_URL


var fs          = require('fs'),
    path        = require('path'),
    Url         = require('url'),
    config      = require('../config.js');


// returns a config object
module.exports = init();


function init(){
	var configInfo = {
		'server': {}
	};

	// get the options for the right environment from config.js
	var nodeEnv = (process.env.NODE_ENV) ? process.env.NODE_ENV : 'development',
		env = config.environments[nodeEnv];

	if(!env){
		throw ('no configation for ' + nodeEnv + 'environment the in config.js file');
	}	

	// loop environment properties and add them to root of configInfo object
	for (var key in env) {
		if (env.hasOwnProperty(key)) {
			configInfo[key] = env[key];
		}
	}

	if (config.site) {
		configInfo.site = config.site;
	}

	mapProcessEnv( configInfo );
	return configInfo;
}


// overload config object with process.env properties
// only copies properties starting with words in 'startsWithList' list
function mapProcessEnv( configInfo ) {
  	var startsWithList = ['server', 'database', 'logging'],
    	items,
    	value;

  	for (var key in process.env) {
    	if (process.env.hasOwnProperty(key)) {
      		value = process.env[key];
      		key = key.toLowerCase();
      		items = [key];
      		if (key.indexOf('_') > -1) {
        		items = key.split('_')
      		}
      		if (startsWithList.indexOf(items[0]) > -1) {
      			setDeepValue(configInfo, items.join('.'), value)
      		}
    	}
  	}

  	// override port if its given by hosting provider
  	if (process.env.PORT) {
    	configInfo.server.port = process.env.PORT
  	}
  	if (process.env.HOST) {
    	configInfo.server.host = process.env.HOST
  	}
};


// set a property deep in object using js path string
function setDeepValue(obj, path, value) {
    path = path.split('.');
    
    if(path.length > 1){
        var item = path.shift();
        if(obj[item] == null || typeof obj[item] !== 'object'){
             obj[item] = {};
        }
        setDeepValue(obj[item], value, path);
    }else{
        obj[path[0]] = value;
    }
}





