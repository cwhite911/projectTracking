'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


/**
 * Article Schema
 */
var ArticleSchema = new Schema({
    created: {
        type: Date,
        default: Date.now
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    content: {
        type: String,
        required: true,
        trim: true
    },
    path: {
        type: String,
        required: true,
        trim: true
    },
    transaction: {
        type: Number,
        required: true,
    },
    subdivision: {
        type: Number,
        required: true,
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    }
});

/**
 * Validations
 */
ArticleSchema.path('title').validate(function(title) {
    return !!title;
}, 'Title cannot be blank');

ArticleSchema.path('content').validate(function(content) {
    return !!content;
}, 'Content cannot be blank');

ArticleSchema.path('path').validate(function(path) {
    return !!path;
}, 'Content cannot be blank');

/**
 * Statics
 */
ArticleSchema.statics.load = function(id, cb) {
    this.findOne({
        _id: id
    }).populate('user', 'name username').exec(cb);
};

mongoose.model('Article', ArticleSchema);
