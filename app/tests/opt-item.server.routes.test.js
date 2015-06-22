'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	OptItem = mongoose.model('OptItem'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, optItem;

/**
 * Opt item routes tests
 */
describe('Opt item CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Opt item
		user.save(function() {
			optItem = {
				name: 'Opt item Name'
			};

			done();
		});
	});

	it('should be able to save Opt item instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Opt item
				agent.post('/opt-items')
					.send(optItem)
					.expect(200)
					.end(function(optItemSaveErr, optItemSaveRes) {
						// Handle Opt item save error
						if (optItemSaveErr) done(optItemSaveErr);

						// Get a list of Opt items
						agent.get('/opt-items')
							.end(function(optItemsGetErr, optItemsGetRes) {
								// Handle Opt item save error
								if (optItemsGetErr) done(optItemsGetErr);

								// Get Opt items list
								var optItems = optItemsGetRes.body;

								// Set assertions
								(optItems[0].user._id).should.equal(userId);
								(optItems[0].name).should.match('Opt item Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Opt item instance if not logged in', function(done) {
		agent.post('/opt-items')
			.send(optItem)
			.expect(401)
			.end(function(optItemSaveErr, optItemSaveRes) {
				// Call the assertion callback
				done(optItemSaveErr);
			});
	});

	it('should not be able to save Opt item instance if no name is provided', function(done) {
		// Invalidate name field
		optItem.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Opt item
				agent.post('/opt-items')
					.send(optItem)
					.expect(400)
					.end(function(optItemSaveErr, optItemSaveRes) {
						// Set message assertion
						(optItemSaveRes.body.message).should.match('Please fill Opt item name');
						
						// Handle Opt item save error
						done(optItemSaveErr);
					});
			});
	});

	it('should be able to update Opt item instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Opt item
				agent.post('/opt-items')
					.send(optItem)
					.expect(200)
					.end(function(optItemSaveErr, optItemSaveRes) {
						// Handle Opt item save error
						if (optItemSaveErr) done(optItemSaveErr);

						// Update Opt item name
						optItem.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Opt item
						agent.put('/opt-items/' + optItemSaveRes.body._id)
							.send(optItem)
							.expect(200)
							.end(function(optItemUpdateErr, optItemUpdateRes) {
								// Handle Opt item update error
								if (optItemUpdateErr) done(optItemUpdateErr);

								// Set assertions
								(optItemUpdateRes.body._id).should.equal(optItemSaveRes.body._id);
								(optItemUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Opt items if not signed in', function(done) {
		// Create new Opt item model instance
		var optItemObj = new OptItem(optItem);

		// Save the Opt item
		optItemObj.save(function() {
			// Request Opt items
			request(app).get('/opt-items')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Opt item if not signed in', function(done) {
		// Create new Opt item model instance
		var optItemObj = new OptItem(optItem);

		// Save the Opt item
		optItemObj.save(function() {
			request(app).get('/opt-items/' + optItemObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', optItem.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Opt item instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Opt item
				agent.post('/opt-items')
					.send(optItem)
					.expect(200)
					.end(function(optItemSaveErr, optItemSaveRes) {
						// Handle Opt item save error
						if (optItemSaveErr) done(optItemSaveErr);

						// Delete existing Opt item
						agent.delete('/opt-items/' + optItemSaveRes.body._id)
							.send(optItem)
							.expect(200)
							.end(function(optItemDeleteErr, optItemDeleteRes) {
								// Handle Opt item error error
								if (optItemDeleteErr) done(optItemDeleteErr);

								// Set assertions
								(optItemDeleteRes.body._id).should.equal(optItemSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Opt item instance if not signed in', function(done) {
		// Set Opt item user 
		optItem.user = user;

		// Create new Opt item model instance
		var optItemObj = new OptItem(optItem);

		// Save the Opt item
		optItemObj.save(function() {
			// Try deleting Opt item
			request(app).delete('/opt-items/' + optItemObj._id)
			.expect(401)
			.end(function(optItemDeleteErr, optItemDeleteRes) {
				// Set message assertion
				(optItemDeleteRes.body.message).should.match('User is not logged in');

				// Handle Opt item error error
				done(optItemDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		OptItem.remove().exec();
		done();
	});
});