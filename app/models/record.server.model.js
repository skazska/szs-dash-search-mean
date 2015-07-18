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

mongoose.model('Record', RecordSchema);