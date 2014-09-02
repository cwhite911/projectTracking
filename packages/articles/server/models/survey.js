'use strict';

/**
 * Module dependencies.
 */
var GeoJSON = require('mongoose-geojson-schema');
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


/**
 * Article Schema
 */
var SurveySchema = new Schema({
    created: {
        type: Date,
        default: Date.now
    },
    projectId: {type: String},
    surveyPoints : GeoJSON.FeatureCollection,
    // user: {
    //     type: Schema.ObjectId,
    //     ref: 'User'
    // }  
});

/**
 * Validations
 */
// SurveySchema.path('surveyPoints.features').validate(function(surveyPoints.features) {
//     return !!surveyPoints.features;
// }, 'surveyPoints.features cannot be blank');

/**
 * Statics
 */
// Schema.statics.load = function(id, cb) {
//     this.findOne({
//         _id: id
//     }).populate('user', 'name username').exec(cb);
// };
// SurveySchema.statics.load = function(id, cb) {
//     this.findOne({
//         _id: id
//     }).populate('user', 'name username').exec(cb);
// };

mongoose.model('Survey', SurveySchema);