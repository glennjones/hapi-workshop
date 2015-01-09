// removed while token info is add into user object

/*'use strict';

// Example of integration tests - http request, modules and database together

var Mongo               = require('mongodb'),
    Hapi                = require('hapi'),
    Chai                = require('chai'),
    Users               = require('../lib/users.js'),
    Auth                = require('../lib/auth.js'),
    Routes              = require('../lib/routes.js');
   
var assert = Chai.assert;


describe('bookmarks api -', function() {

    var currentId,
        server, 
        user = {
          'name' : 'Test Account',
          'email' : 'test@gmail.com',
          'username' : 'test',
          'password' : '$2a$10$f0qEHx9LG.eDDO//MjmZlO9GCf0pwPaQ2EOPL5Vyuoyr4ESLTPsaq',
          'created' : ISODate('2014-12-05T20:15:08.804Z'),
          'modified' : ISODate('2014-12-05T20:15:08.804Z'),
          'revokeToken' : 'X1wF6SxW',
          'groups' : [ 
              'user', 
              'admin'
          ]
        }, 
        output = {
          url: 'http://example.com',
          title: 'Example title',
          tags: ['tag1', 'tag2'],
          description: 'Description of example page',
          host: 'example.com',
        }



    before(function(done) {
      server = new Hapi.Server();
      server.connection({ port: 8000 });

      // adds auth plugin
      server.register([{
              register: require('hapi-auth-basic')
          },{
              register: require('hapi-auth-bearer-token')
          },{
              register: require('hapi-auth-cookie')
          }], function (err) {
          if (err) {
              console.error(err);
          }else{

              // add auth strategies, before routes
              server.auth.strategy('basic', 'basic', { validateFunc: Auth.validateBasic});
              server.auth.strategy('bearer', 'bearer-access-token', {validateFunc: Auth.validateBearer});
              server.auth.strategy('cookie', 'cookie', {
                  password: '72F9b7!5-cCb0-44H5-8^f2-374&5%40d53e',
                  cookie: 'sid',
                  redirectTo: '/logon',
                  isSecure: false,
                  validateFunc: Auth.validateCookie
              });


              // hapi server settings
              server.route(Routes);
              server.views({
                      path: 'templates',
                      engines: { html: require('handlebars') },
                      partialsPath: './templates/withPartials',
                      helpersPath: './templates/helpers',
                      isCached: false
                  })

              server.start(function(){
                  done();
              });
          }
      });
    });


    after(function(done) {
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
        assert.equal(res.statusCode, 200);

        var doc = JSON.parse(res.payload);
        currentId = doc.id;

        assert.ok(doc.created);
        assert.ok(doc.modified);
        assert.ok(doc.id);
        assert.deepEqual( output, removeUnknownProps(doc) );
      
        done();
      });
    });


    it('get a bookmark through api', function(done){
      server.inject({method: 'GET', url: '/bookmarks/' + currentId}, function (res) {
        assert.equal(res.statusCode, 200);

        var doc = JSON.parse(res.payload);
        assert.ok(doc.created);
        assert.ok(doc.modified);
        assert.ok(doc.id);
        assert.deepEqual( output, removeUnknownProps(doc) );

        done();
      });
    });


  it('find a bookmark through api', function(done){
    server.inject({method: 'GET', url: '/bookmarks/?page=1&pagesize=20'}, function (res) {
      assert.equal(res.statusCode, 200);

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

      done();
    });
  });



  it('find a bookmark through api without sending pageing options', function(done){
    server.inject({method: 'GET', url: '/bookmarks/'}, function (res) {
      assert.equal(res.statusCode, 200);
      var docs = JSON.parse(res.payload);

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
    var payload = {
        url: 'http://example.com/2',
        title: 'Example title 2',
        tags: 'tag3, tag4',
        description: 'Description of example page 2'
    };

    server.inject({method: 'PUT', url: '/bookmarks/' + currentId, payload: JSON.stringify(payload)}, function (res) {
      assert.equal(res.statusCode, 200);

      var doc = JSON.parse(res.payload);
      assert.equal(doc.url, 'http://example.com/2');
      assert.equal(doc.title, 'Example title 2');
      assert.equal(doc.description, 'Description of example page 2');
      assert.equal(doc.host, 'example.com');
      assert.ok(doc.created);
      assert.ok(doc.modified);

      done();
    });
  });


  it('remove a bookmark', function(done){
    server.inject({method: 'DELETE', url: '/bookmarks/' + currentId}, function (res) {
      assert.equal(res.statusCode, 200);

      var doc = JSON.parse(res.payload);
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
*/