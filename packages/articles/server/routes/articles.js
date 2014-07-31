'use strict';
var articles = require('../controllers/articles');
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
 //    app.use(bodyParser());
	// app.use(methodOverride());
    app.use(busboy());
//     app.use(app.router);

	app.set('docs', '../projectTracking/packages/articles/public/assets/asbuilts');
    app.route('/articles')
        .get(articles.all)
        .post(auth.requiresLogin, articles.uploadFile(app.get('docs')))
        .post(auth.requiresLogin, articles.create);
        
    	
    app.route('/articles/:articleId')
        .get(articles.show)
        .put(auth.requiresLogin, hasAuthorization, articles.update)
        .delete(auth.requiresLogin, hasAuthorization, articles.destroy);

    // Finish with setting up the articleId param
    app.param('articleId', articles.article);
};
