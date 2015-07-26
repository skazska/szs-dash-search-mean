'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Record Schema
 */
var RecordSchema = new Schema({
  type: {
    type: String
  },
	items: [{
    type: Schema.Types.ObjectId,
    ref: 'OptItem',
    required: 'Please fill items',
//    validate: [notEmpty, 'Please assign items'],
    index: true
	}],
	values: [{
		type: Schema.Types.Mixed ,
//		required: 'Please fill values',
		trim: true
	}],
  actualUntil: {
    type: Date
  },
  created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	}
});

//function notEmpty(value){
//  return value.length > 0;
//}

RecordSchema.path('items').validate(function (value) {
  return value.length > 0;
}, 'Please fill at least 1 item');

RecordSchema.path('values').validate(function (value) {
  return value.length >= 0;
}, 'Please fill at least 0 value');

/**
 * middleware pre-save
 * - fills actualUntil with now + 30 days if empty
 * - substitutes items with _id's if objects are assigned
 */
RecordSchema.pre('save', function (next) {
  if (!this.actualUntil) {
    this.actualUntil = Date.now() + 1000 * 60 * 60 * 24 * 30;
  }
//  this.items = this.items.map(function(item){
//    return item._id || item;
//  });
  next();
});

mongoose.model('Record', RecordSchema);