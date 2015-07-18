'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	OptItem = mongoose.model('OptItem');

/**
 * Globals
 */
var user, optItem;

/**
 * Unit tests
 */
describe('Opt item Model Unit Tests:', function() {
	beforeEach(function(done) {
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: 'username',
			password: 'password',
      provider: 'local'
		});

		user.save(function() { 
			optItem = new OptItem({
				user: user
			});

			done();
		});
	});

  describe('Method Save', function() {

    it('should start with no "opt" "item" optItem', function(done){
      OptItem.find({option:'opt', id: 'item'}, function(err, opts) {
        opts.should.have.length(0);
        done();
      });
    });

    it('should be able to show an error when try to save without id ', function(done) {
      optItem.option = 'opt'; optItem.save(function (err) { should.exist(err); done(); });
    });
    it('should be able to show an error when try to save without option', function(done) {
      optItem.id = 'item'; optItem.save(function (err) { should.exist(err); done(); });
    });

    it('should be able to show an error when try to save with empty id ', function(done) {
      optItem.option = ''; optItem.id = 'item';
      optItem.save(function (err) { should.exist(err); done(); });
    });
    it('should be able to show an error when try to save empty option', function(done) {
      optItem.id = ''; optItem.option = 'opt';
      optItem.save(function (err) { should.exist(err); done(); });
    });

    it('should be able to show an error when try to save with illegal id', function(done) {
      optItem.id = '+ss'; optItem.option = 'opt';
      optItem.save(function(err) { should.exist(err); done(); });
    });
    it('should be able to show an error when try to save with illegal option', function(done) {
      optItem.id = 'item'; optItem.option = 'opt/';
      optItem.save(function(err) { should.exist(err); done(); });
    });

    it('should be able to save, assigning id to title if it not set', function(done) {
      optItem.id = 'item'; optItem.option = 'opt';
      return optItem.save(function(err) {
        should.not.exist(err);
        OptItem.findOne({id:'item', option:'opt'}, function(err, opts) {
          opts.should.containEql({id:"item", title:"item"});
          done();
        });
      });
    });

    it('should save all fields as is', function(done) {
      optItem.option = 'opt';
      optItem.id = 'item';
      optItem.title = 'optItem';
      optItem.description = 'description';
      optItem.logo = 'logo';
      return optItem.save(function(err) {
        OptItem.findOne({id:'item', option:'opt'}, function(err, opts) {
          opts.should.containEql({option:'opt', id:'item', title:'optItem', logo:'logo', description:'description'});
          done();
        });
      });
    });
  });

	afterEach(function(done) { 
		OptItem.remove().exec();
		User.remove().exec();

		done();
	});
});