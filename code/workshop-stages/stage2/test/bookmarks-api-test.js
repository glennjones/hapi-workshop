'use strict';

// Example of integration tests - http request, modules and database together

var Mongo               = require('mongodb'),
    Hapi                = require('hapi'),
    Chai                = require('chai'),
    Bookmarks           = require('../lib/bookmarks').Bookmarks,
    Routes              = require('../lib/routes.js');
   
var assert = Chai.assert;


describe('bookmarks api -', function() {

    var bookmarks,
        currentId,
        db,
        server,   
        output = {
          url: 'http://example.com',
          title: 'Example title',
          tags: ['tag1', 'tag2'],
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
          Routes.init(db);
          done();
        }
      });
    });


    beforeEach(function(done) {
      server = new Hapi.Server({debug: false});
      server.route(Routes.routes);
      done();
    });


    afterEach(function(done) {
      server.stop(function() {
        server = null;
        done();
      });
    });



    it('add bookmark through api', function(done) {
      var payload = {
          url: 'http://example.com',
          title: 'Example title',
          tags: 'tag1, tag2',
          description: 'Description of example page',
      };

      server.inject({method: 'POST', url: '/bookmarks/', payload: JSON.stringify(payload)}, function (res) {

        var doc = JSON.parse(res.payload);
        currentId = doc.id;

        assert.ok(doc.created);
        assert.ok(doc.modified);
        assert.ok(doc.id);
        assert.deepEqual( output, removeUnknownProps(doc) );

        assert.equal(res.statusCode, 200);
        done();
      });
    });


    it('get a bookmark through api', function(done){
      server.inject({method: 'GET', url: '/bookmarks/' + currentId}, function (res) {
        var doc = JSON.parse(res.payload);

        assert.ok(doc.created);
        assert.ok(doc.modified);
        assert.ok(doc.id);
        assert.deepEqual( output, removeUnknownProps(doc) );

        assert.equal(res.statusCode, 200);
        done();

      });
    });


  it('find a bookmark through api', function(done){
    server.inject({method: 'GET', url: '/bookmarks/?page=1&pagesize=20'}, function (res) {
      var docs = JSON.parse(res.payload);

      assert.ok(docs, 'should return an object');
      assert.equal(docs.items.length, 1, 'docs array should have 1 item');

      var doc = docs.items[0];
      assert.ok(doc.created);
      assert.ok(doc.modified);
      assert.ok(doc.id);
      assert.deepEqual( output, removeUnknownProps(doc) );

      assert.equal(docs.count, 1);
      assert.equal(docs.page, 1);
      assert.equal(docs.pageCount, 1);
      assert.equal(docs.pageSize, 20);

      assert.equal(res.statusCode, 200);
      done();
    });
  });



  it('find a bookmark through api without sending pageing options', function(done){
    server.inject({method: 'GET', url: '/bookmarks/'}, function (res) {
      var docs = JSON.parse(res.payload);

      assert.ok(docs);
      assert.equal(docs.items.length, 1);

      assert.equal(docs.count, 1);
      assert.equal(docs.page, 1);
      assert.equal(docs.pageCount, 1);
      assert.equal(docs.pageSize, 10);

      assert.equal(res.statusCode, 200);
      done();
     });
  });


  it('update a bookmark', function(done){
    var payload = {
        url: 'http://example.com/2',
        title: 'Example title 2',
        tags: 'tag3, tag4',
        description: 'Description of example page 2'
    };

    server.inject({method: 'PUT', url: '/bookmarks/' + currentId, payload: JSON.stringify(payload)}, function (res) {
      var doc = JSON.parse(res.payload);

      assert.equal(doc.url, 'http://example.com/2');
      assert.equal(doc.title, 'Example title 2');
      assert.equal(doc.description, 'Description of example page 2');
      assert.equal(doc.host, 'example.com');
      assert.ok(doc.created);
      assert.ok(doc.modified);

      assert.equal(res.statusCode, 200);
      done();
    });
  });


  it('remove a bookmark', function(done){
    server.inject({method: 'DELETE', url: '/bookmarks/' + currentId}, function (res) {
      var doc = JSON.parse(res.payload);

      assert.equal(doc.id, currentId);
      assert.equal(res.statusCode, 200);

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
