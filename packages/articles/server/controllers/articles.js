'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Article = mongoose.model('Article'),
    _ = require('lodash');

var path = require('path');
var fs = require('fs');
var busboy = require('connect-busboy');
var join = path.join;
/**
 * Find article by id
 */
exports.article = function(req, res, next, id) {
    Article.load(id, function(err, article) {
        if (err) return next(err);
        if (!article) return next(new Error('Failed to load article ' + id));
        req.article = article;
        next();
    });
};

/**
 * Create an article
 */
exports.create = function(req, res) {
    var article = new Article(req.body);
    article.user = req.user;

    article.save(function(err) {
        if (err) {
            return res.jsonp(500, {
                error: 'Cannot save the article'
            });
        }
        res.jsonp(article);

    });
   
    
};

exports.uploadFile = function(dir){
    return function(req, res, next){
        var fstream;
        // res.setHeader('Content-Type', 'multipart/form-data');
        req.pipe(req.busboy);
        req.busboy.on('file', function (fieldname, file, filename) {
            console.log("Uploading: " + filename); 
            fstream = fs.createWriteStream(dir + filename);
            file.pipe(fstream);
            fstream.on('close', function () {
                res.redirect('back');
            });
   		});
    }
              
    
};

/**
 * Update an article
 */
exports.update = function(req, res) {
    var article = req.article;

    article = _.extend(article, req.body);

    article.save(function(err) {
        if (err) {
            return res.jsonp(500, {
                error: 'Cannot update the article'
            });
        }
        res.jsonp(article);

    });
};

/**
 * Delete an article
 */
exports.destroy = function(req, res) {
    var article = req.article;

    article.remove(function(err) {
        if (err) {
            return res.jsonp(500, {
                error: 'Cannot delete the article'
            });
        }
        res.jsonp(article);

    });
};

/**
 * Show an article
 */
exports.show = function(req, res) {
    res.jsonp(req.article);
};

/**
 * List of Articles
 */
exports.all = function(req, res) {
    Article.find().sort('-created').populate('user', 'name username').exec(function(err, articles) {
        if (err) {
            return res.jsonp(500, {
                error: 'Cannot list the articles'
            });
        }
        res.jsonp(articles);

    });
};
