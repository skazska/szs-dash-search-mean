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
 * id - a technical item id - required, unique, /[A-Za-z0-9\-_]/
 * option - an option
 * title - a representative name  - optional, but filled by name if not set
 * description - a descriptive text    - optional
 * logo - a URL to logo image of group - optional
 */
var OptItemSchema = new Schema({
//  _id: {
//    type: String,
//    default: '',
//    required: 'Please fill Item id',
//    trim: true,
//    validate: [idValid, 'Only /[A-Za-z0-9\-_]+/ accepted for {PATH}']
//    index: true
//  },
  option: {
    type: String,
    required: 'Please assign to option',
    validate: [idValid, 'Only /[A-Za-z0-9\-_]+/ accepted for {PATH}'],
    trim: true,
    ref: 'Option',
    index: true
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