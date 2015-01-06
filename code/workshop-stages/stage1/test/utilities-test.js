'use strict';

// Example of unit tests

var Chai		= require('chai'),
	Utils       = require('../lib/utilities.js');


var assert = Chai.assert;

describe('utilities -', function(){


	it('clone', function(done){
		var result,
			obj = {
				item: {
					str: 'test',
					num: 10,
					arr: [20]
				}
			};

		result = Utils.clone(obj)
		assert.deepEqual( obj, result);
	    done();
	});


	it('clone - drops functions', function(done){
		var result,
			obj = {
				str: 'test',
				fnc: function(){}
			};

		result = Utils.clone(obj)
		assert.deepEqual(  {str: 'test'}, result );
        done();
	});


	it('isString', function(done){
		assert.equal( Utils.isString('test'), true );
		assert.equal( Utils.isString(10), false );
		assert.equal( Utils.isString({'test': 'test'}), false );
		assert.equal( Utils.isString(['test']), false );
		assert.equal( Utils.isString(function(){}), false );
	    done();
	});


	it('isArray', function(done){
		assert.equal( Utils.isArray(['test']), true );
		assert.equal( Utils.isArray(10), false );
		assert.equal( Utils.isArray({'test': 'test'}), false );
		assert.equal( Utils.isArray('test'), false );
		assert.equal( Utils.isArray(function(){}), false );
	    done();
	});


	it('trim', function(done){
		assert.equal( Utils.trim('test'), 'test' );
		assert.equal( Utils.trim('test '), 'test' );
		assert.equal( Utils.trim(' test'), 'test' );
		assert.equal( Utils.trim(' test '), 'test' );
		assert.equal( Utils.trim('    test    '), 'test' );
		assert.equal( Utils.trim(''), '' );
	    done();
	});


	it('trimItemsOfArray', function(done){
		assert.deepEqual( Utils.trimItemsOfArray(['test']), ['test'] );
		assert.deepEqual( Utils.trimItemsOfArray(['test',' test ']), ['test','test'] );
		assert.deepEqual( Utils.trimItemsOfArray(['test ']), ['test'] );
		assert.deepEqual( Utils.trimItemsOfArray([' test']), ['test'] );
		assert.deepEqual( Utils.trimItemsOfArray([' test ']), ['test'] );
		assert.deepEqual( Utils.trimItemsOfArray(['    test    ']), ['test'] );
		assert.deepEqual( Utils.trimItemsOfArray(['']), [''] );
	    done();
	});


	it('cleanDoc', function(done){
		var result,
			doc = {
				str: 'test',
				_id: 'test',
				__v: 'test'
			};

		result = Utils.cleanDoc(doc)
		assert.deepEqual( {str: 'test'}, result );
        done();
	});


	it('generateID', function(done){
		assert.ok(Utils.generateID());
		assert.equal( Utils.generateID().length, 4 );
        done();
	});





});