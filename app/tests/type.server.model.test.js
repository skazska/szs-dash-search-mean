'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Type = mongoose.model('Type');

/**
 * Globals
 */
var user, type;

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
 * Unit tests
 */
describe('Type Model Unit Tests:', function() {
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

		type = new Type({
			user: user
		});

		user.save(function(err) {
			done(err);
		});
	});

	describe('Method Save', function() {
		it('should start with no  type', function(done){
			Type.find(function(err, types) {
				types.should.have.length(0);
				done();
			});
		});
		it('should be able to show an error when try to save with empty title', function(done) {
			return type.save(function(err) {
				should.exist(err);
				done();
			});
		});
		it('should save and set viewInListTpl, viewTpl, editTpl and modelValidator to "text" if empty', function(done) {
			type.title = 'Title';
			return type.save(function(err, data) {
				should.not.exist(err);
				Type.findById(data._id, function(err, types) {
					if (err) return done(err);
					types.should.containEql({
						title : 'Title',
						viewInListTpl : 'text',
						viewTpl : 'text',
						editTpl : 'text',
						modelValidator : 'text',
						user: user._id
					});
					done();
				});
			});
		});

		it('should save and set viewInListTpl, viewTpl, editTpl and modelValidator to "text" if undefined', function(done) {
			type.title = 'Title';
			type.viewInListTpl = '';
			type.viewTpl = '';
			type.editTpl = '';
			type.modelValidator = '';
			return type.save(function(err, data) {
				should.not.exist(err);
				Type.findById(data._id, function(err, types) {
					if (err) return done(err);
					types.should.containEql({
						title : 'Title',
						viewInListTpl : 'text',
						viewTpl : 'text',
						editTpl : 'text',
						modelValidator : 'text',
						user: user._id
					});
					done();
				});
			});
		});

		it('should save all fields as is', function(done) {
			type.title = 'Title';
			type.viewInListTpl = 'ListTpl';
			type.viewTpl = 'ViewTpl';
			type.editTpl = 'EditTpl';
			type.modelValidator = 'ModelValidator';

			return type.save(function(err, data) {
				should.not.exist(err);
				Type.findById(data._id, function(err, types) {
					if (err) return done(err);
					types.should.containEql({
						title : 'Title',
						viewInListTpl : 'ListTpl',
						viewTpl : 'ViewTpl',
						editTpl : 'EditTpl',
						modelValidator : 'ModelValidator',
						user: user._id
					});
					done();
				});
			});
		});
	});

	afterEach(function(done) { 
		Type.remove().exec();
		User.remove().exec();

		done();
	});
});