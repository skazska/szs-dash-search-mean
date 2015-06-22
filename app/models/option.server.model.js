'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Option Schema
 * This schema represents the option, option is a grouping feature of filter
 * items.
 * It consists of:
 * name - a technical option name - required, unique, /[A-Za-z0-9\-_]/
 * title - a representative name  - optional, but filled by name if not set
 * description - a descriptive text    - optional
 * logo - a URL to logo image of group - optional
 * -------------------
 * created, user - technical fields
 */
var OptionSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Option name',
		trim: true,
    index: true
	},
  title: {
    type: String,
    default: 'Same as name',
    trim: true
  },
  description: {
    type: String,
    default: '',
    trim: true
  },
  logo:{
    type: String,
    default: '',
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

/**
 * middleware pre-save
 * - fills title with name if empty or 'Same as name'
 */
OptionSchema.pre('save', function (next) {
  if (!this.title || this.title == 'Same as name') {
    this.title = this.name;
  }
  next();
});

mongoose.model('Option', OptionSchema);