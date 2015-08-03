'use strict';

var should = require('should'),
	request = require('supertest'),
	async = require('async'),
	_ = require('lodash'),
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
 * should respond 400 "???" if data contains _id
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
 * should respond 400 "resource id does not match object id" if data contains _id and it not match :typeId
 * should respond 400 "Please fill Type title" when POST with no or empty title
 * should respond 400 "Please fill Type viewInListTpl" when POST with no or empty viewInListTpl
 * should respond 400 "Please fill Type viewTpl" when POST with no or empty viewTpl
 * should respond 400 "Please fill Type editTpl" when POST with no or empty editTpl
 * should respond type_data had been PUT
 * READ: fires on /types/:typeId GET  uses types.read
 * should respond with type_data have been PUT
 * DELETE: fires on /types/:typeId DELETE  uses types.delete
 * should require authorization
 * should respond 404 when wrong typeIt are given
 * /types/:typeId GET should respond 404 after DELETE with :typeId
 */

/**
 * Globals
 */
var urlPrefix = '/search-api/types';
//credentials, user, type;
function auth(credentials, next){
	//authenticating
	agent.post('/auth/signin')
		.send(credentials)
		.expect(200)
		.end(function(signinErr, signinRes) {
				if (signinErr) return next(signinErr);
			next();
		});
}

function noAuth(next){
	//authenticating
	agent.get('/auth/signout')
//		.send(credentials)
//		.expect(200)
		.end(function(signoutErr, signinRes) {
			if (signoutErr) return next(signoutErr);
			next();
		});
}


/**
 * Type routes tests
 */
describe('Type CRUD tests', function() {

	var tests = [
		{
			id: 'scenario1',
			credentials:{
				username: 'username',
				password: 'password'
			},
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
	];

	//prepare dependencies
	before(function(done){
		async.eachSeries(tests, function(test, callback){
			test.user.save(callback);
		}, done);
	});

//	beforeEach(function(done) {
//		done();
//	});
	afterEach(function(done) {
		noAuth(done);
	});


	after(function(done){
		Type.remove().exec();
		User.remove().exec();
		done();
	});

	describe('/types(POST) - create', function(){
		tests.forEach(function(test){
			var testId = test.id;
			it('should require authentication:'+testId,function(done){
				agent.post(urlPrefix).send(test.postData).expect(401, done);
			});
			it('should respond 400 "???" if data contains _id:'+testId,function(done){
				auth(test.credentials, function (authErr) {

					if (authErr) return done(authErr);
					var data = _.assign({}, test.postData);
					data._id= '345234FFA2345234FFA2345234FFA2A3';
					agent.post(urlPrefix).send(data).expect(400, done);
				});
			});
			async.each(['title', 'viewInListTpl', 'viewTpl', 'editTpl'],function(field){
				it('should respond 400 "Please fill Type '+field+'" when POST with no or empty '+field+':'+testId,function(done){
					auth(test.credentials, function (authErr) {
						if (authErr) return done(authErr);
						var data = _.assign({}, test.postData);
						data[field] = '';
						agent.post(urlPrefix).send(data).expect(400, done);
					});
				});
			});
			it('should respond type_data with _id property being set',function(done){
				auth(test.credentials, function (authErr) {
					if (authErr) return done(authErr);
					agent.post(urlPrefix).send(test.postData).expect(200).end(function (httpErr, httpRes) {
						if (httpErr) done(httpErr);
						test.type = httpRes.body;
//						var type = httpRes.body;
						test.type.should.be.an.Object('incorrect record returned:'+test.id).with.properties(['_id']);
						test.type.should.containEql(test.postData);
						done();
					})
				});
			});
		})
	});

	describe('READ LIST:  fires on /types/GET uses types.list', function(){
		tests.forEach(function(test) {
			var testId = test.id;
			it('should respond with JSON array containing inserted type data objects: '+testId, function (done) {
				agent.get(urlPrefix).end(function (err, res) {
					if (err) return done(err);
					res.body.should.be.an.Array().with.length(1);
					res.body[0].should.have.properties({
						_id: test.type._id,
						title: test.type.title
					});
					done();
				});
			});
		});
	});

	describe('UPDATE:  fires on /types/:typeId PUT type_data  uses types.update', function(){
		tests.forEach(function(test){
			var testId = test.id;
			it('should require authentication:'+testId,function(done){

				agent.put(urlPrefix+'/'+test.type._id).send(test.type).expect(401, done);
			});
			it('should respond 404 when wrong typeIt are given: '+testId, function(done){
				auth(test.credentials, function (authErr) {
					if (authErr) return done(authErr);
					var data = _.assign({}, test.postData);
					data._id= '55bf3ba49b27fc9e0e5647ba';
					agent.put(urlPrefix+'/'+data._id).send(data).expect(404, done);
				});
			});
			it('should respond 400 "resource id does not match object id" if data contains _id and it not match :typeId: '+testId, function(done){
				auth(test.credentials, function (authErr) {
					if (authErr) done(authErr);
					var data = _.assign({}, test.type);
					data._id= '55bf3ba49b27fc9e0e5647ba';
					agent.put(urlPrefix+'/'+test.type._id).send(data).expect(400, done);
				});
			});
			async.each(['title', 'viewInListTpl', 'viewTpl', 'editTpl'],function(field){
				it('should respond 400 "Please fill Type title" when POST with no or empty '+field+':'+testId,function(done){
					var data = _.assign({}, test.type);
					auth(test.credentials, function (authErr) {
						if (authErr) return done(authErr);
						data[field] = '';
						agent.put(urlPrefix+'/'+test.type._id).send(data).expect(400, done);
					});
				});
			});
			it('should respond type_data being PUT',function(done){
				auth(test.credentials, function (authErr) {
					if (authErr) done(authErr);
					test.type.title = 'UPDATED';
					agent.put(urlPrefix+'/'+test.type._id).send(test.type).end(function (httpErr, httpRes) {
						if (httpErr) return done(httpErr);
						test.type = httpRes.body;
//						var type = httpRes.body;
						test.type.should.be.an.Object('incorrect record returned:'+test.id).with.properties(['_id']);
						test.type.should.containEql(test.type);
						done();
					})
				});
			});
		})
	});

	describe('READ: fires on /types/:typeId GET  uses types.read', function(){
		tests.forEach(function(test) {
			var testId = test.id;
			it('should respond with type_data had been PUT: '+testId, function (done) {
				agent.get(urlPrefix + '/' + test.type._id).end(function (err, res) {
					if (err) return done(err);
					res.body.should.have.properties({_id: test.type._id, title: test.type.title});
					done();
				});
			});
		});
	});
	describe('DELETE: fires on /types/:typeId DELETE  uses types.delete', function(){
		tests.forEach(function(test) {
			var testId = test.id;
			it('should require authorization: '+testId, function (done) {
				agent.delete(urlPrefix + '/' + test.type._id).expect(401, done);
			});
			it('should respond 404 when wrong typeId are given: '+testId, function (done) {
				auth(test.credentials, function (authErr) {
					if (authErr) return done(authErr);
					agent.delete(urlPrefix + '/55bf3ba49b27fc9e0e5647ba').expect(404, done);
				});
			});
			it('/types/:typeId GET should respond 404 after DELETE with :typeId: '+testId, function (done) {
				auth(test.credentials, function (authErr) {
					if (authErr) return done(authErr);
					agent.delete(urlPrefix + '/' + test.type._id).expect(200).end(function (err, res) {
						if (err) return done(err);
						agent.get(urlPrefix + '/' + test.type._id).expect(404, done);
					});
				});
			});
		});
	});

//	afterEach(function(done) {
//		User.remove().exec();
//		Type.remove().exec();
//		done();
//	});
});