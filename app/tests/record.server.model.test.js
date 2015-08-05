'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
  async = require('async'),
  errorHandler = require('../controllers/errors.server.controller'),
  User = mongoose.model('User'),
  Option = mongoose.model('Option'),
  OptItem = mongoose.model('OptItem'),
  Type = mongoose.model('Type'),
  Record = mongoose.model('Record');


/**
 * Globals
 */
var user, option, optItem, record, type;

/**
 * Record Schema
 * This schema represents the record, record is the main data being of project
 * It consists of:
 * type - value type(schema)
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
			password: 'password',
      provider: 'local'
		});
    option = new Option({
      _id: 'opt',
      user: user
    });
    optItem = new OptItem({
      id: 'Item',
      option:option,
      user:user
    });
    type = new Type({
      title: 'type'
    });

    record = new Record({
      user: user
    });
    async.eachSeries(
      [user, option, optItem, type],
      function(model, cb){
        model.save(function(err, data) {
          should.not.exist(err);
          cb();
        });
      },
      done
    );
	});

	describe('Method Save', function() {
    it('should start with no records', function (done) {
      Record.find(function (err, itms) {
        should.not.exist(err);
        itms.should.have.length(0);
        done();
      });
    });
    it('should show an error when save with no items or' +
      ' values members or type', function (done) {
      var records = [
        new Record({items:[optItem._id]}),
        new Record({type: '',items:[optItem._id]}),
        new Record({type: type._id, items:[]}),
        new Record({type: type._id}),
      ];
      async.each(
        records,
        function (rec, cb) {
          rec.save(function (err) {
            should.exist(err, rec);
            cb();
          });
        },
        function (err) {
          should.not.exist(err);
          done();
        }
      );
    });

    it('should save with some items and set actualUntil to now +30 days', function (done) {
      record.items = [optItem._id];
      record.values = ['val'];
      record.type = type._id;
      var dt1 = new Date(Date.now() + 1000*60*60*24*30);
      record.save(function (err, data) {
        var dt2 = new Date(Date.now() + 1000*60*60*24*30);
        should.not.exist(err);
        (data.actualUntil).should.not.be.lessThan(dt1);
        (data.actualUntil).should.not.be.greaterThan(dt2);
        done();
      });

    });

  });

  afterEach(function (done) {
    Record.remove().exec();
    OptItem.remove().exec();
    Option.remove().exec();
    Type.remove().exec();
    User.remove().exec();

    done();
  });
});