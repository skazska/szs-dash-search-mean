'use strict';

var should = require('should'),
	request = require('supertest'),
  async = require('async'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
  Option = mongoose.model('Option'),
  OptItem = mongoose.model('OptItem'),
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
 * items - an Item reference list (Item is a classification atom,
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
  var user1, user2, option, optItem1, optItem2, optItem3, record;
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

  var conts = [
    { id: 'test1',
      user:user1, credentials: {username:user1.username, password:user1.password},
      otherUser:user2, otherCredentials: {username:user2.username, password:user2.password},
      record:new Record({items:[optItem1._id, optItem2._id],values:['first','second']})
    },
    { id: 'test2', user:user2,
      credentials: {username:user2.username, password:user2.password},
      otherUser:user1, otherCredentials: {username:user1.username, password:user1.password},
      record:new Record({items: [optItem1._id],values: [ 'third' ]})
    }
  ];

  before(function(done){
    // Save a user to the test db and create new Record
    return async.eachSeries(
      [user1, user2, option, optItem1, optItem2, optItem3 ],
      function(model, cb){
        model.save(function(err, data) {
          should.not.exist(err, 'Error preparing model ');
          cb();
        });
      },
      done
    );
  });

  after(function(done){
    User.remove().exec();
    Option.remove().exec();
    OptItem.remove().exec();
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
      if (signinErr) next(signinErr);
//        should.not.exist(signinErr, 'error authenticating ' +
// credentials.username);
        next();
      });
  }

  //posts
  describe('/records(POST) - create', function(){
    conts.forEach(function(cont){
      it('should process and return record when authorized'+ cont.id, function(done){
        auth(cont.credentials, function(err){
          if (err) done(err);
          agent.post('/records').send(cont.record).end(
            function(postErr, postRes){
//              if (postErr) done(postErr);
              should.not.exist(postErr, 'error posting record:'+cont.id);
              (postRes).should.have.a.properties(['_id', 'user'], 'post response have no _id or user:'+cont.id)
                .which.is.not.empty('post response`s _id or user are empty:'+cont.id);
              (postRes.user).should.be.equal(post.user._id, 'post response`s user _id does not match:'+cont.id);
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
          agent.get('/records').end(function(recordsGetErr, recordsGetRes) {
//            if (recordsGetErr) done(recordsGetErr);
            should.not.exist(recordsGetErr, 'error getting records:'+cont.id);
            var records = recordsGetRes.body;
            records.should.be.an.Array.with.length.greaterThan(0, 'no records in list:'+cont.id);
            //check all records correspond context user
            var good = async.every(records, function(rec, cb){
              cb(rec.user._id == cont.user._id);
            });
            (good).should.be.ok('other user`s records got:'+cont.id);
            done();
          });
        });
      });
    });
  });

  //get own record
  describe('/records/:recordId(GET) - list', function() {
    conts.forEach(function (cont) {
      it('should return users record', function(done){
        auth(cont.credentials, function () {
          agent.get('/records/'+cont.record._id).end(function(recordsGetErr, recordsGetRes) {
//            if (recordsGetErr) done(recordsGetErr);
            should.not.exist(recordsGetErr, 'error getting record:'+cont.id);
            var record = recordsGetRes.body;
            record.should.be.an.Object('incorrect record returned:'+cont.id)
              .with.properties(['_id', 'items', 'values', 'actualUntil']);
            record.items.should.containDeep(cont.record.items);
            done();
          });
        });
      });
    });
  });

  //get other`s record
  describe('/records/:recordId(GET) - list', function() {
    conts.forEach(function (cont) {
      it('should refuse request for record of other user', function(done){
        auth(cont.otherCredentials, function () {
          agent.get('/records/'+cont.record._id).end(function(recordsGetErr, recordsGetRes) {
//            if (recordsGetErr) callback(recordsGetErr);
            should.not.exist(recordsGetErr, 'error getting record:'+cont.id);
            var record = recordsGetRes.body;
            record.should.be.an.Object('incorrect record returned:'+cont.id)
              .with.properties(['_id', 'items', 'values', 'actualUntil']);
            record.items.should.containDeep(cont.record.items);
            callback();
          });
        });
      });
    });
  });

/*
	it('should not be able to save Record instance if no name is provided', function(done) {
		// Invalidate name field
		record.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user1.id;

				// Save a new Record
				agent.post('/records')
					.send(record)
					.expect(400)
					.end(function(recordSaveErr, recordSaveRes) {
						// Set message assertion
						(recordSaveRes.body.message).should.match('Please fill Record name');
						
						// Handle Record save error
						done(recordSaveErr);
					});
			});
	});

	it('should be able to update Record instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user1.id;

				// Save a new Record
				agent.post('/records')
					.send(record)
					.expect(200)
					.end(function(recordSaveErr, recordSaveRes) {
						// Handle Record save error
						if (recordSaveErr) done(recordSaveErr);

						// Update Record name
						record.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Record
						agent.put('/records/' + recordSaveRes.body._id)
							.send(record)
							.expect(200)
							.end(function(recordUpdateErr, recordUpdateRes) {
								// Handle Record update error
								if (recordUpdateErr) done(recordUpdateErr);

								// Set assertions
								(recordUpdateRes.body._id).should.equal(recordSaveRes.body._id);
								(recordUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a single Record if not signed in', function(done) {
		// Create new Record model instance
		var recordObj = new Record(record);

		// Save the Record
		recordObj.save(function() {
			request(app).get('/records/' + recordObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', record.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Record instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user1.id;

				// Save a new Record
				agent.post('/records')
					.send(record)
					.expect(200)
					.end(function(recordSaveErr, recordSaveRes) {
						// Handle Record save error
						if (recordSaveErr) done(recordSaveErr);

						// Delete existing Record
						agent.delete('/records/' + recordSaveRes.body._id)
							.send(record)
							.expect(200)
							.end(function(recordDeleteErr, recordDeleteRes) {
								// Handle Record error error
								if (recordDeleteErr) done(recordDeleteErr);

								// Set assertions
								(recordDeleteRes.body._id).should.equal(recordSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Record instance if not signed in', function(done) {
		// Set Record user 
		record.user = user1;

		// Create new Record model instance
		var recordObj = new Record(record);

		// Save the Record
		recordObj.save(function() {
			// Try deleting Record
			request(app).delete('/records/' + recordObj._id)
			.expect(401)
			.end(function(recordDeleteErr, recordDeleteRes) {
				// Set message assertion
				(recordDeleteRes.body.message).should.match('User is not logged in');

				// Handle Record error error
				done(recordDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Record.remove().exec();
		done();
	});
  */
});