'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
  async = require('async'),
  errorHandler = require('../controllers/errors.server.controller'),
  User = mongoose.model('User'),
  Record = mongoose.model('Record');


/**
 * Globals
 */
var user, record;

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
 *
 *
 *
 */


/**
 * Unit tests
 */
describe('Record Model Unit Tests:', function() {
	beforeEach(function(done) {
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: 'username',
			password: 'password'
		});

		user.save(function() { 
			record = new Record({
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
    it('should start with no records', function(done){
      Record.find(function(err, itms) {
        should.not.exist(err);
        itms.should.have.length(0);
        done();
      });
    });
    it('should be able to show an error when try to save with no items or' +
      ' values members', function(done) {
      var records = [new Record({}), new Record({items:[]}), new Record({values:[]})];
      async.each(
        records,
        function(rec){
          rec.save(function(err) {
            should.exist(err);
            should(errorHandler.getErrorMessage(err)).match('Please fill');
            should(errorHandler.getErrorMessage(err)).match(/items|values/);
          });
        },
        function(err){
          should.not.exist(err);
          done();
        }
      );
    });
	});

  it('should be able to show an error when try to save with no items or' +
    ' values members', function(done) {
    record.items = [];
    record.values= [];
    record.save(function(err) {
      should.exist(err);
      should(errorHandler.getErrorMessage(err)).match('Please assign items');
      done();
    });
  });

  it('should save with some items', function(done) {
    record.items = ['Item1'];
    record.values= [];
    record.save(function(err) {
      should.not.exist(err);
      done();
    });

  });

	afterEach(function(done) { 
		Record.remove().exec();
		User.remove().exec();

		done();
	});
});