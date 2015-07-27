'use strict';

var should = require('should'),
	request = require('supertest'),
	async = require('async'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Type = mongoose.model('Type'),
	agent = request.agent(app);

/**
 * Type Schema
 * This schema represents type of record`s values, it should define view and edit
 * templates representing value if front-end
 * It consist of:
 * _id - objectId, builtin, PK - technical identifier
 * title - string, required - name of type
 * viewInListTpl - string, required - name of template to represent value in list
 * viewTpl - string, required - name of template to represent single value
 * editTpl - string, required - name of template to edit single value
 * modelValidator - string, - name of model validator function module
 */

/**
 * Routes
 * @param app
 *
 * /types
 *  get - returns list
 *  post - creates type and returns it
 * /types/:typeId
 *  get - returns type by _id
 *  put - update type by _id
 *  delete - removes type
 */

/**
 * Scenario.
 * =========
 * CREATE: fires on /types POST type_data   uses types.create
 * should require authentication
 * should respond 400 "Please fill Type title" when POST with no or empty title
 * should respond 400 "Please fill Type viewInListTpl" when POST with no or empty viewInListTpl
 * should respond 400 "Please fill Type viewTpl" when POST with no or empty viewTpl
 * should respond 400 "Please fill Type editTpl" when POST with no or empty editTpl
 * should respond type_data with _id property being set
 * READ LIST:  fires on /types/GET uses types.list
 * should respond with JSON array containing inserted type data objects
 * UPDATE:  fires on /types/:typeId PUT type_data  uses types.update
 * should require authentication
 * should respond 404 when wrong typeIt are given
 * should respond 400 "Please fill Type title" when POST with no or empty title
 * should respond 400 "Please fill Type viewInListTpl" when POST with no or empty viewInListTpl
 * should respond 400 "Please fill Type viewTpl" when POST with no or empty viewTpl
 * should respond 400 "Please fill Type editTpl" when POST with no or empty editTpl
 * should respond type_data had been PUT
 * READ: fires on /types/:typeId GET  uses types.read
 * should respond with type_data have been PUT
 * DELETE: fires on /types/:typeId DELETE  uses types.delete
 * should respond 404 when wrong typeIt are given
 * /types/:typeId GET should respond 404 after DELETE with :typeId
 */

/**
 * Globals
 */
var urlPrefix = '/search-api/types';
//credentials, user, type;
function auth(user, next){
	var credentials = {username: user.username, password: user.password};
	//authenticating
	agent.post('/auth/signin')
		.send(credentials)
		.expect(200)
		.end(function(signinErr, signinRes) {
			if (signinErr) next(signinErr);
			next();
		});
}


/**
 * Type routes tests
 */
describe('Type CRUD tests', function() {

	var tests = {
		scenario1:{
			user: new User({
				firstName: 'Full',
				lastName: 'Name',
				displayName: 'Full Name',
				email: 'test@test.com',
				username: 'username',
				password: 'password',
				provider: 'local'
			}),
			postData: {
				title : 'Title',
				viewInListTpl : 'ListTpl',
				viewTpl : 'ViewTpl',
				editTpl : 'EditTpl',
				modelValidator : 'ModelValidator'
			}
		}
	};

	//prepare dependencies
	before(function(done){
		async.eachSeries(tests, function(test, callback){
			test.user.save(callback);
		}, done);
	});

	beforeEach(function(done) {
	});

	after(function(done){
		Type.remove();
		User.remove();
		done();
	});

	describe('/types(POST) - create', function(){
		tests.forEach(function(test, testId){
			it('should require authentication:'+testId,function(done){
				agent.post(urlPrefix).send(test.postData).expect(403, done);
			});
			it('should respond 400 "Please fill Type title" when POST with no or empty title:'+testId,function(done){
				auth(test.user, function (authErr) {
					if (authErr) done(authErr);
					agent.post(urlPrefix).send(test.postData).expect(400)
				});
			});
			it('should respond 400 "Please fill Type viewInListTpl" when POST with no or empty viewInListTpl:'+testId,function(done){});
			it('should respond 400 "Please fill Type viewTpl" when POST with no or empty viewTpl:'+testId,function(done){});
			it('should respond 400 "Please fill Type editTpl" when POST with no or empty editTpl:'+testId,function(done){});
			it('should respond type_data with _id property being set',function(done){
				auth(test.user, function (authErr) {
					if (authErr) done(authErr);
					agent.post(urlPrefix).send(test.postData).end(function (httpErr, httpRes) {
						if (httpErr) done(httpErr);
						var type = httpRes.body;
						type.should.be.an.Object('incorrect record returned:'+cont.id).with.properties(['_id']);
						type.should.containEql(test.postData);
						done();
					})
				});

			});
		})
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