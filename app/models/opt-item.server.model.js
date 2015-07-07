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
 * id - a technical option name - required, unique, /[A-Za-z0-9\-_]/
 * title - a representative name  - optional, but filled by name if not set
 * description - a descriptive text    - optional
 * logo - a URL to logo image of group - optional
 */
var OptItemSchema = new Schema({
  _id: {
    type: String,
    default: '',
    required: 'Please fill Option id',
    trim: true,
    validate: [idValid, 'Only /[A-Za-z0-9\-_]+/ accepted for {PATH}']
//    index: true
  },
  option: {
    type: String,
    ref: 'Option'
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

OptItemSchema.pre('save', function (next) {
  if (!this.title || this.title == 'Same as id') {
    this.title = this._id;
  }
  next();
});

/**
 * setter id -> _id
 */
OptItemSchema.virtual('id').set(function(id){
  this._id = id;
});
/**
 * getter id -> _id
 */
OptItemSchema.virtual('id').get(function(){
  return this._id;
});

mongoose.model('OptItem', OptItemSchema);