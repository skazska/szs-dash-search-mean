'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Option = mongoose.model('Option'),
  OptItem = mongoose.model('OptItem'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, optItem, option;
var urlPrefix = '/search-api/options/opt/items';
var optionId = 'opt';
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

    option = new Option({
      _id: "opt",
      user: user
    });

    optItem = {
      id: 'item',
      title: 'title',
      description: 'description',
      logo: 'logo'
    };

		// Save a user to the test db and create new Opt item
		user.save(function() {
      option.save(function() {
        done();
      });
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
				agent.post(urlPrefix+'')
					.send(optItem)
					.expect(200)
					.end(function(optItemSaveErr, optItemSaveRes) {
						// Handle Opt item save error
						if (optItemSaveErr) done(optItemSaveErr);

						// Get a list of Opt items
						agent.get(urlPrefix+'')
							.end(function(optItemsGetErr, optItemsGetRes) {
								// Handle Opt item save error
								if (optItemsGetErr) done(optItemsGetErr);

								// Get Opt items list
								var optItems = optItemsGetRes.body;

								// Set assertions
								(optItems[0].user._id).should.equal(userId);
                optItems[0].should.containEql({id:'item', title:'title', logo:'logo', description:'description'});

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Opt item instance if not logged in', function(done) {
		agent.post(urlPrefix+'')
			.send(optItem)
			.expect(401)
			.end(function(optItemSaveErr, optItemSaveRes) {
				// Call the assertion callback
				done(optItemSaveErr);
			});
	});

	it('should not be able to save Opt item instance if no id is provided', function(done) {
		// Invalidate name field
		optItem.id = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Opt item
				agent.post(urlPrefix+'')
					.send(optItem)
					.expect(400)
					.end(function(optItemSaveErr, optItemSaveRes) {
						// Set message assertion
						(optItemSaveRes.body.message).should.match('Please assign an id');
						
						// Handle Opt item save error
						done(optItemSaveErr);
					});
			});
	});

  it('should not be able to save Opt item instance if no option is provided', function(done) {
    agent.post('/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function(signinErr, signinRes) {
        // Handle signin error
        if (signinErr) done(signinErr);

        // Get the userId
        var userId = user.id;

        // Save a new Opt item
        agent.post(urlPrefix.replace('opt/', ''))
          .send(optItem)
          .expect(404)
          .end(function(optItemSaveErr, optItemSaveRes) {
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
				agent.post(urlPrefix+'')
					.send(optItem)
					.expect(200)
					.end(function(optItemSaveErr, optItemSaveRes) {
						// Handle Opt item save error
						if (optItemSaveErr) done(optItemSaveErr);

						// Update Opt item name
						optItem.title = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Opt item
						agent.put(urlPrefix+'/' + optItemSaveRes.body._id)
							.send(optItem)
							.expect(200)
							.end(function(optItemUpdateErr, optItemUpdateRes) {
								// Handle Opt item update error
								if (optItemUpdateErr) done(optItemUpdateErr);

								// Set assertions
								(optItemUpdateRes.body._id).should.equal(optItemSaveRes.body._id);
								(optItemUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Opt items if not signed in', function(done) {
		// Create new Opt item model instance
		var optItemObj = new OptItem(optItem);
    optItemObj.option = option;

		// Save the Opt item
		optItemObj.save(function(err) {
			if (err) {done(err);}
			// Request Opt items
			request(app).get(urlPrefix+'')
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
    optItemObj.option = option;

		// Save the Opt item
		optItemObj.save(function() {
			request(app).get(urlPrefix+'/' + optItemObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('title', optItem.title);

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
				agent.post(urlPrefix+'')
					.send(optItem)
					.expect(200)
					.end(function(optItemSaveErr, optItemSaveRes) {
						// Handle Opt item save error
						if (optItemSaveErr) done(optItemSaveErr);

						// Delete existing Opt item
						agent.delete(urlPrefix+'/' + optItemSaveRes.body._id)
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
			request(app).delete(urlPrefix+'/' + optItemObj._id)
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
		Option.remove().exec();
    User.remove().exec();
		OptItem.remove().exec();
		done();
	});
});