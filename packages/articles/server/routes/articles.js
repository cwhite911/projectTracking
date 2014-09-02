'use strict';
var articles = require('../controllers/articles');
var survey = require('../controllers/survey');
// var bodyParser = require('body-parser');
// var methodOverride = require('method-override');
var busboy = require('connect-busboy');

// Article authorization helpers
var hasAuthorization = function(req, res, next) {
    if (!req.user.isAdmin && req.article.user.id !== req.user.id) {
        return res.send(401, 'User is not authorized');
    }
    next();
};

module.exports = function(Articles, app, auth) {
    app.use(busboy());
    app.set('asbuilts', __dirname + '/docs/asbuilts/');
    app.set('surveys', __dirname + '/docs/survey/');
    app.route('/articles')
        .get(articles.all)
        .post(auth.requiresLogin, articles.create);
    app.route('/articles/asbuilt') 
        .post(auth.requiresLogin, articles.uploadFile(app.get('asbuilts')));
    app.route('/survey')
        .post(auth.requiresLogin, survey.uploadFile(app.get('surveys')))
        .get(auth.requiresLogin, survey.show);
    app.route('/articles/:articleId')
        .get(articles.show)
        .put(auth.requiresLogin, hasAuthorization, articles.update)
        .delete(auth.requiresLogin, hasAuthorization, articles.destroy);
    // Finish with setting up the articleId param
    app.param('articleId', articles.article);
    // app.param('surveyId', survey.article);
};
