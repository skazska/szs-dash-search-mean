'use strict';

var should = require('should'),
	request = require('supertest'),
  async = require('async'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
  Option = mongoose.model('Option'),
  OptItem = mongoose.model('OptItem'),
  Type = mongoose.model('Type'),
	Record = mongoose.model('Record'),
	agent = request.agent(app);

/**
 * Globals
 */
var urlPrefix = '/search-api/records';
/**
 * Record Schema
 * This schema represents the record, record is the main data being of project
 * It consists of:
 * actualUntil - a date of expiration
 * items - an Item list (Item is a classification atom,
 * represented by an Item Schema) list should contain at least (one) Item
 * values - list of subject data records relevant to the classification set
 * -------------------
 * created, user - technical fields
 */

/**
 * Routes
 * @param app
 *
 * /records
 *  get - returns list
 *  post - creates record and returns it
 * /records/:recordId
 *  get - returns record by _id
 *  put - update record by _id
 *  delete - removes record
 */



/**
 * Record routes tests
 */
describe('Record CRUD:', function() {
  var user1, user2, option, optItem1, optItem2, optItem3, type, record;
  user1 = new User({
    firstName: 'Full',
    lastName: 'Name',
    displayName: 'Full Name',
    email: 'test@test.com',
    username: 'username',
    password: 'password',
    provider: 'local'
  });
  user2 = new User({
    firstName: 'Full',
    lastName: 'Name',
    displayName: 'Full Name',
    email: 'test@test.com',
    username: 'username1',
    password: 'password1',
    provider: 'local'
  });

  option = new Option({
    _id: 'opt',
  });

  optItem1 = new OptItem({
    id: 'Item1',
    option:option,
  });
  optItem2 = new OptItem({
    id: 'Item2',
    option:option,
  });
  optItem3 = new OptItem({
    id: 'Item3',
    option:option,
  });
  type = Type({
    title: 'type'
  })
  var conts = [
    { id: 'test1',
      user:user1, credentials: {username:user1.username, password:user1.password},
      otherUser:user2, otherCredentials: {username:user2.username, password:user2.password},
      recordSend:new Record({type: type._id, items:[optItem1._id, optItem2._id],values:['first','second']}),
      record:new Record({type: type, items:[optItem1, optItem2],values:['first','second']})
    },
    { id: 'test2', user:user2,
      credentials: {username:user2.username, password:user2.password},
      otherUser:user1, otherCredentials: {username:user1.username, password:user1.password},
      recordSend:new Record({type: type._id, items: [optItem1._id],values: [ 'third' ]}),
      record:new Record({type: type, items: [optItem1],values: [ 'third' ]})
    }
  ];

  before(function(done){
    // Save a user to the test db and create new Record
    async.series([
      function(callback){
        async.eachSeries(
          [user1, user2, option, optItem1, optItem2, optItem3, type ],
          function(model, cb){
            model.save(function(err, data) {
              should.not.exist(err, 'Error preparing model ');
              cb();
            });
          },
          callback
        );
      },
      function(callback){
        async.each(conts, function(cont, cb){
          cont.record.populate('items', 'option title', cb);
        },
        callback
        );
      }
    ], done
    );
  });

  after(function(done){
    User.remove().exec();
    Option.remove().exec();
    OptItem.remove().exec();
    Type.remove().exec();
    Record.remove().exec();
    done();
  });

  function auth(credentials, next){
    //authenticating
    agent.post('/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function(signinErr, signinRes) {
        // Handle signin error
      if (signinErr) return next(signinErr);
//        should.not.exist(signinErr, 'error authenticating ' +
// credentials.username);
        next();
      });
  }

  //posts
  describe('/records(POST) - create', function(){
    conts.forEach(function(cont, i){
      it('should process and return record when authorized'+ cont.id, function(done){
        auth(cont.credentials, function(err){
          if (err) return done(err);
          agent.post(urlPrefix).send(cont.recordSend).expect(200).end(
            function(postErr, postRes){
              if (postErr) return done(postErr);
              var record = postRes.body;
              record.should.be.Object().with.properties(['user', '_id']);
              record.user.should.be.eql(cont.user._id.toString());

              //prepare to next tests
              conts[i].record._id = record._id;

              done();
            }
          );
        });
      })
    })
  });

  //get lists
  describe('/records(GET) - list', function() {
    conts.forEach(function (cont) {
      it('should return list ot user`s records', function(done){
        auth(cont.credentials, function(){
          agent.get(urlPrefix).end(function(recordsGetErr, recordsGetRes) {
            if (recordsGetErr) return done(recordsGetErr);
//            should.not.exist(recordsGetErr, 'error getting records:'+cont.id);
            recordsGetRes.status.should.be.within(200, 399);
            var records = recordsGetRes.body;
            records.should.be.an.Array().which.is.not.empty();
            //check all records correspond context user
            async.every(records, function(rec, cb){
              cb(rec.user._id == cont.user._id);
            }, function(result){
              result.should.be.true();
              done();
            });
          });
        });
      });
    });
  });

  //get own record an update
  describe('/records/:recordId(GET) - own record', function() {
    conts.forEach(function (cont) {
      it('should return users record', function(done){
        auth(cont.credentials, function () {
          agent.get(urlPrefix+'/'+cont.record._id).end(function(recordsGetErr, recordsGetRes) {
            if (recordsGetErr) return  done(recordsGetErr);
            recordsGetRes.status.should.be.within(200, 399);
            var record = recordsGetRes.body;
            record.should.be.an.Object('incorrect record returned:'+cont.id)
              .with.properties(['_id', 'items', 'values', 'actualUntil']);
            record.items.should.containDeep(
              cont.record.toObject().items//.map(function(item){return item;})
            );
            done();

          });
        });
      });
    });
  });

  //get other`s record
  describe('/records/:recordId(GET) - others record', function() {
    conts.forEach(function (cont) {
      it('should refuse request for record of other user', function(done){
        auth(cont.otherCredentials, function () {
          agent.get(urlPrefix+'/'+cont.record._id).expect(403, done);
        });
      });
    });
  });

  //update own record
  describe('/records/:recordId(PUT) - modify own record', function() {
    conts.forEach(function (cont) {
      it('should return users record', function(done){
        cont.recordSend.values.push('test');
        cont.record.values.push('test');
        auth(cont.credentials, function () {
          agent.put(urlPrefix+'/'+cont.record._id).send(cont.recordSend).expect(200)
            .end(function(recordsGetErr, recordsGetRes) {
              if (recordsGetErr) return done(recordsGetErr);
//              recordsGetRes.status.should.be.within(200, 399);
              agent.put(urlPrefix+'/'+cont.record._id).end(function(recErr, recRes){
                if (recErr) done(recErr);
                var record = recRes.body;
                record.values.should.containDeep(
                  cont.record.toObject().values
                );
                done();

              });

            });
        });
      });
    });
  });

  //modify other`s record
  describe('/records/:recordId(PUT) - modify others record', function() {
    conts.forEach(function (cont) {
      it('should refuse request for record of other user', function(done){
        auth(cont.otherCredentials, function () {
          agent.put(urlPrefix+'/'+cont.record._id).send(cont.record).expect(403, done);
        });
      });
    });
  });

  //remove other`s record
  describe('/records/:recordId(DELETE) - remove others record', function() {
    conts.forEach(function (cont) {
      it('should refuse request for record of other user', function(done){
        auth(cont.otherCredentials, function () {
          agent.delete(urlPrefix+'/'+cont.record._id).send(cont.record).expect(403, done);
        });
      });
    });
  });

  //remove own record
  describe('/records/:recordId(DELETE) - remove own record', function() {
    conts.forEach(function (cont) {
      it('should refuse request for record of other user', function(done){
        auth(cont.credentials, function () {
          agent.delete(urlPrefix+'/'+cont.record._id).send(cont.record).expect(200, done);
        });
      });
    });
  });

  //check no records left
  describe('/records(GET) - empty list', function() {
    conts.forEach(function (cont) {
      it('should return list ot user`s records', function (done) {
        auth(cont.credentials, function () {
          agent.get(urlPrefix).end(function(recordsGetErr, recordsGetRes) {
            if (recordsGetErr) return done(recordsGetErr);
//            should.not.exist(recordsGetErr, 'error getting records:'+cont.id);
            recordsGetRes.status.should.be.within(200, 399);
            var records = recordsGetRes.body;
            records.should.be.an.Array().which.is.empty();
            done();
          });
        });
      });
    });
  });

});