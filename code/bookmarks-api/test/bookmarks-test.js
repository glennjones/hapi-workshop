'use strict';

// Example of integration tests - module and database together

var Mongo       = require('mongodb'),
	Chai		= require('chai'),
	Bookmarks   = require('../lib/bookmarks').Bookmarks;


var assert = Chai.assert;


describe('bookmarks -', function(){
	var bookmarks,
		currentId,
		newDoc = {
				item: {
					url: 'http://example.com',
					title: 'Example title',
					tags: ['tag1','tag2'],
					description: 'Description of example page'
				}
			},
		output = {
			url: 'http://example.com',
			title: 'Example title',
			tags: ['tag1','tag2'],
			description: 'Description of example page',
			host: 'example.com',
		}


	// setup test database;
    before(function(done) {
		Mongo.MongoClient.connect('mongodb://localhost:27017/bookmarks-test', {'server': {'auto_reconnect': true}}, function (err, db) {
		  if (err) {
		    console.log(['error', 'database', 'connection'], err);
		    done();
		  }else{
		    bookmarks = new Bookmarks( db );
		    bookmarks.removeAll(function(){});
		    done();
		  }
		});
    });



	it('add a bookmark', function(done){
		bookmarks.add(newDoc, function(err, doc){

			currentId = doc.id;

			assert.equal( err, null );
			assert.ok( doc.created );
			assert.ok( doc.modified );
			assert.ok( doc.id );
			assert.deepEqual( output, removeUnknownProps(doc) );
			done();
		});
	});


	it('get a bookmark', function(done){
		var options = {
			id: currentId,
		};
		bookmarks.get( options, function(err, doc){
			assert.equal(err, null);
			assert.ok(doc.created);
			assert.ok(doc.modified);
			assert.ok(doc.id);
			assert.deepEqual( output, removeUnknownProps(doc) );
			done();
		});
	});


	it('find a bookmark', function(done){
		var options = {
			page: 1,
			pageSize: 20
		};
		bookmarks.find(options, function(err, docs){
			assert.equal(err, null);
			assert.ok(docs);
			assert.equal(docs.items.length, 1);
			var doc = docs.items[0];

			assert.ok(doc.created);
			assert.ok(doc.modified);
			assert.ok(doc.id);
			assert.deepEqual( output, removeUnknownProps(doc) );

			assert.equal(docs.count, 1);
			assert.equal(docs.page, 1);
			assert.equal(docs.pageCount, 1);
			assert.equal(docs.pageSize, 20);
			done();
		});
	});

	it('find a bookmark without sending pageing options', function(done){
		var options = {};
		bookmarks.find(options, function(err, docs){
			assert.equal(err, null);
			assert.ok(docs);
			assert.equal(docs.items.length, 1);

			assert.equal(docs.count, 1);
			assert.equal(docs.page, 1);
			assert.equal(docs.pageCount, 1);
			assert.equal(docs.pageSize, 10);
			done();
		});
	});


	it('update a bookmark', function(done){
		var options = {
			id: currentId,
			item: {
				url: 'http://example.com/2',
				title: 'Example title 2',
				tags: ['tag3','tag4'],
				description: 'Description of example page 2'
			}
		};
		bookmarks.update(options, function(err, doc){
			assert.equal(err, null);
			assert.equal(doc.url, 'http://example.com/2');
			assert.equal(doc.title, 'Example title 2');
			assert.deepEqual(doc.tags, ['tag3','tag4']);
			assert.equal(doc.description, 'Description of example page 2');
			assert.equal(doc.host, 'example.com');
			assert.ok(doc.created);
			assert.ok(doc.modified);
			assert.equal(doc.id, currentId);
			done();
		});
	});


	it('remove a bookmark', function(done){
		var options = {
			id: currentId
		};
		bookmarks.remove(options, function(err, doc){
			assert.equal(err, null);
			assert.equal(doc.id, currentId);
			done();
		});
	});

});


// function to remove properties whos 
// value cannot know at time of test
function removeUnknownProps(doc){
	delete doc.created;
	delete doc.modified;
	delete doc.id;
	return doc
}


