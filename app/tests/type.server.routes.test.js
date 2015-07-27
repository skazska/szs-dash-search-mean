'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Type = mongoose.model('Type'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, type;

/**
 * Type routes tests
 */
describe('Type CRUD tests', function() {
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

		// Save a user to the test db and create new Type
		user.save(function() {
			type = {
				name: 'Type Name'
			};

			done();
		});
	});

	it('should be able to save Type instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Type
				agent.post('/types')
					.send(type)
					.expect(200)
					.end(function(typeSaveErr, typeSaveRes) {
						// Handle Type save error
						if (typeSaveErr) done(typeSaveErr);

						// Get a list of Types
						agent.get('/types')
							.end(function(typesGetErr, typesGetRes) {
								// Handle Type save error
								if (typesGetErr) done(typesGetErr);

								// Get Types list
								var types = typesGetRes.body;

								// Set assertions
								(types[0].user._id).should.equal(userId);
								(types[0].name).should.match('Type Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Type instance if not logged in', function(done) {
		agent.post('/types')
			.send(type)
			.expect(401)
			.end(function(typeSaveErr, typeSaveRes) {
				// Call the assertion callback
				done(typeSaveErr);
			});
	});

	it('should not be able to save Type instance if no name is provided', function(done) {
		// Invalidate name field
		type.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Type
				agent.post('/types')
					.send(type)
					.expect(400)
					.end(function(typeSaveErr, typeSaveRes) {
						// Set message assertion
						(typeSaveRes.body.message).should.match('Please fill Type name');
						
						// Handle Type save error
						done(typeSaveErr);
					});
			});
	});

	it('should be able to update Type instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Type
				agent.post('/types')
					.send(type)
					.expect(200)
					.end(function(typeSaveErr, typeSaveRes) {
						// Handle Type save error
						if (typeSaveErr) done(typeSaveErr);

						// Update Type name
						type.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Type
						agent.put('/types/' + typeSaveRes.body._id)
							.send(type)
							.expect(200)
							.end(function(typeUpdateErr, typeUpdateRes) {
								// Handle Type update error
								if (typeUpdateErr) done(typeUpdateErr);

								// Set assertions
								(typeUpdateRes.body._id).should.equal(typeSaveRes.body._id);
								(typeUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Types if not signed in', function(done) {
		// Create new Type model instance
		var typeObj = new Type(type);

		// Save the Type
		typeObj.save(function() {
			// Request Types
			request(app).get('/types')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Type if not signed in', function(done) {
		// Create new Type model instance
		var typeObj = new Type(type);

		// Save the Type
		typeObj.save(function() {
			request(app).get('/types/' + typeObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', type.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Type instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Type
				agent.post('/types')
					.send(type)
					.expect(200)
					.end(function(typeSaveErr, typeSaveRes) {
						// Handle Type save error
						if (typeSaveErr) done(typeSaveErr);

						// Delete existing Type
						agent.delete('/types/' + typeSaveRes.body._id)
							.send(type)
							.expect(200)
							.end(function(typeDeleteErr, typeDeleteRes) {
								// Handle Type error error
								if (typeDeleteErr) done(typeDeleteErr);

								// Set assertions
								(typeDeleteRes.body._id).should.equal(typeSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Type instance if not signed in', function(done) {
		// Set Type user 
		type.user = user;

		// Create new Type model instance
		var typeObj = new Type(type);

		// Save the Type
		typeObj.save(function() {
			// Try deleting Type
			request(app).delete('/types/' + typeObj._id)
			.expect(401)
			.end(function(typeDeleteErr, typeDeleteRes) {
				// Set message assertion
				(typeDeleteRes.body.message).should.match('User is not logged in');

				// Handle Type error error
				done(typeDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Type.remove().exec();
		done();
	});
});