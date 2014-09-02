'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Survey = mongoose.model('Survey');
    // _ = require('lodash');


var fs = require('fs');

var geojson = require('./csvToGeojson');
// var busboy = require('connect-busboy');

/**
 * Find survey by id
 */
//         if (!survey) return next(new Error('Failed to load survey ' + id));
//         if (err) return next(err);
//         next();
//         req.survey = survey;
//     Survey.load(id, function(err, survey) {
//     });
// exports.survey = function(req, res, next, id) {
// };

/**
 * Create an survey
 */
// exports.create = function(req, res) {
//     var survey = new Survey(req.body);
//     survey.user = req.user;

//     survey.save(function(err) {
//         if (err) {
//             return res.jsonp(500, {
//                 error: 'Cannot save the survey'
//             });
//         }
//         res.jsonp(survey);

//     });
   
    
// };

exports.uploadFile = function(dir){
    return function(req, res, next){
        var fstream;
        req.pipe(req.busboy);
        req.busboy.on('file', function (fieldname, file, filename) {
            console.log('Uploading: ' + filename); 

            var folder = fieldname;
            var path = dir + folder + '/' + filename;
            if (fs.exists(dir + folder)){
                fstream = fs.createWriteStream(path);
                file.pipe(fstream);
                fstream.on('close', function () {
                    res.redirect('back');
                });
            }
            else {
                fs.mkdir(dir + folder);
                fstream = fs.createWriteStream(path);
                file.pipe(fstream);
                fstream.on('close', function () {
                res.redirect('back');
            });
            }
            geojson.setProjectId(folder);
            geojson.getCSV(path);
   		});

        // var surveyPoints = new Survey(geojson.getGeojson());
        //     surveyPoints.save(function (err) {
        //         if (err) {
        //             return res.jsonp(500, {
        //                 error: 'Cannot save the survey'
        //             });
        //         }
        //         res.jsonp(surveyPoints);
        //     });
        
    };
              
    
};

/**
 * Update an survey
 */
// exports.update = function(req, res) {
//     var survey = req.survey;

//     survey = _.extend(survey, req.body);

//     survey.save(function(err) {
//         if (err) {
//             return res.jsonp(500, {
//                 error: 'Cannot update the survey'
//             });
//         }
//         res.jsonp(survey);

//     });
// };

// /**
//  * Delete an survey
//  */
// exports.destroy = function(req, res) {
//     var survey = req.survey;

//     survey.remove(function(err) {
//         if (err) {
//             return res.jsonp(500, {
//                 error: 'Cannot delete the survey'
//             });
//         }
//         res.jsonp(survey);

//     });
// };

// /**
//  * Show an survey
//  */
exports.show = function(req, res) {
    var pid = req.query.pid;
    Survey.findOne({projectId: pid}, 'surveyPoints', function (err, project){
        if (err) return err;
        res.jsonp(project.surveyPoints);
    });
    
};

// /**
//  * List of Articles
//  */
// exports.all = function(req, res) {
//     Survey.find().sort('-created').populate('user', 'name username').exec(function(err, survey) {
//         if (err) {
//             return res.jsonp(500, {
//                 error: 'Cannot list the survey'
//             });
//         }
//         res.jsonp(survey);

//     });
// };