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
	items: {
    type: [ Schema.ObjectId ],
    required: 'Please fill items',
//    validate: [notEmpty, 'Please assign items'],
    index: true
	},
	values: {
		type: [ Schema.Mixed ],
//		required: 'Please fill values',
		trim: true
	},
  actualUntil: {
    type: Date
  },
  created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

//function notEmpty(value){
//  return value.length > 0;
//}

/**
 * middleware pre-save
 * - fills actualUntil with now + 30 days if empty
 */
RecordSchema.pre('save', function (next) {
  if (!this.actualUntil) {
    this.actualUntil = Date.now() + 1000 * 60 * 60 * 24 * 30;
  }
  next();
});

mongoose.model('Record', RecordSchema);