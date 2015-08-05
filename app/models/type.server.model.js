'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

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
var TypeSchema = new Schema({
	title: {
		type: String,
		default: '',
		required: 'Please fill Type title',
		trim: true
	},
  viewInListTpl: {
    type: String,
    default: 'text',
    trim: true
  },
  viewTpl: {
    type: String,
    default: 'text',
    trim: true
  },
  editTpl: {
    type: String,
    default: 'text',
    trim: true
  },
  modelValidator: {
    type: String,
    default: 'text',
    trim: true
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

TypeSchema.pre('save', function (next) {
  if (this.viewInListTpl == '') {
    this.viewInListTpl = 'text';
  }
  if (this.viewTpl == '') {
    this.viewTpl = 'text';
  }
  if (this.editTpl == '') {
    this.editTpl = 'text';
  }
  if (this.modelValidator == '') {
    this.modelValidator = 'text';
  }
  next();
});


mongoose.model('Type', TypeSchema);