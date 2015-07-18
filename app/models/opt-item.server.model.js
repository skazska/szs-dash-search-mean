'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * validator idValid
 * @param val
 * @returns {boolean}
 */
function idValid (val) {
  return /^[A-Za-z0-9\-_]+$/.test(val);
}


/**
 * Opt item Schema
 * represents values of options
 * It consists of:
 * option - an option technical id - required, /[A-Za-z0-9\-_]/
 * id - and external id - required /[A-Za-z0-9\-_]/
 * title - a representative name  - optional, but filled by name if not set
 * description - a descriptive text    - optional
 * logo - a URL to logo image of group - optional
 */
var OptItemSchema = new Schema({
  option: {
    type: String,
    required: 'Please assign to option',
    validate: [idValid, 'Only /[A-Za-z0-9\-_]+/ accepted for {PATH}'],
    trim: true,
    ref: 'Option',
    index: true
  },
  id: {
    type: String,
    required: 'Please assign an id',
    validate: [idValid, 'Only /[A-Za-z0-9\-_]+/ accepted for {PATH}'],
    trim: true
  },
  title: {
    type: String,
    default: 'Same as id',
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
OptItemSchema.pre('save', function (next) {
  if (!this.title || this.title == 'Same as id') {
    this.title = this.id;
  }
  next();
});

mongoose.model('OptItem', OptItemSchema);