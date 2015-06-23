'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Option = mongoose.model('Option');

/**
 * Globals
 */
var user, option;

/**
 * Unit tests
 */

/**
 * Option Schema
 * This schema represents the option, option is a grouping feature of filter
 * items.
 * It consists of:
 * id - a technical option name - required, unique, /[A-Za-z0-9\-_]/
 * title - a representative name  - optional, but filled by name if not set
 * description - a descriptive text    - optional
 * logo - a URL to logo image of group - optional
 * -------------------
 * created, user - technical fields
 */

describe('Option Model Unit Tests:', function() {
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
			option = new Option({
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
    it('should start with no "opt" option', function(done){
      Option.find({_id:'opt'}, function(err, opts) {
        opts.should.have.length(0);
        done();
      });
    });
    it('should be able to show an error when try to save without id', function(done) {
      return option.save(function(err) {
        should.exist(err);
        done();
      });
    });
    it('should be able to show an error when try to save with empty id', function(done) {
      option.id = '';
      return option.save(function(err) {
        should.exist(err);
        done();
      });
    });
    it('should be able to show an error when try to save with illegal id', function(done) {
      option.id = '+ss';
      return option.save(function(err) {
        should.exist(err);
        done();
      });
    });
		it('should be able to save, assigning id to title if it not set', function(done) {
      option.id = 'opt';
			return option.save(function(err) {
				should.not.exist(err);
        Option.findById('opt', function(err, opts) {
          opts.should.containEql({_id:"opt", title:"opt"});
          done();
        });
			});
		});
    it('should save all fields as is', function(done) {
      option.id = 'opt';
      option.title = 'title';
      option.description = 'description';
      option.logo = 'logo';
      return option.save(function(err) {
        Option.findById('opt', function(err, opts) {
          opts.should.containEql({_id:'opt', title:'title', logo:'logo', description:'description'});
          done();
        });
      });
    });
	});

	afterEach(function(done) { 
		Option.remove().exec();
		User.remove().exec();

		done();
	});
});