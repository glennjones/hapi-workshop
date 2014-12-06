
'use strict';
var Marked          = require('marked'),
	Hapi            = require('hapi'),
	Fs              = require('fs');


module.exports = {

		clone: function( obj ){
			return( JSON.parse( JSON.stringify( obj ) ));
		},	


		isString: function (obj) {
		    return typeof (obj) == 'string';
		},


		isArray: function (obj) {
		    return obj && !(obj.propertyIsEnumerable('length')) 
		        && typeof obj === 'object' 
		        && typeof obj.length === 'number';
		},	


		trim: function (str) {
			if(this.isString(str) && str !== ''){
				return str.replace(/^\s+|\s+$/g, "");
			}else{
				return str;
			}
		},


		trimItemsOfArray: function(arr){
			var i = arr.length;
			while (i--) {
				if(this.isString(arr[i])){
					arr[i] = this.trim(arr[i]);
				}
			}
			return arr;
		},


		generateID: function() {
			return ('0000' + (Math.random()*Math.pow(36,4) << 0).toString(36)).substr(-4);
		},


		cleanDoc: function(doc){
			if(this.isArray(doc)){
				doc = doc[0];
			}
			delete doc._id;
			delete doc.__v;
			doc = this.clone( doc );
			return doc
		},


		// read a file and converts the markdown to HTML
		getMarkDownHTML: function( path, callback ){
				Fs.readFile(path, 'utf8', function (err,data) {
					if (!err) {
						Marked.setOptions({
							gfm: true,
							tables: true,
							breaks: false,
							pedantic: false,
							sanitize: true,
							smartLists: true,
							smartypants: false,
							langPrefix: 'language-',
							highlight: function(code, lang) {
								return code;
							}
						});
						data = Marked(data);           
					}
					callback( err, data );
				});
		}






};