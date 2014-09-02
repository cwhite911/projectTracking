'use strict';

angular.module('mean').controller('ArticlesController', ['$scope', '$http', '$stateParams', '$location', 'Global', 'Articles', 'FileUploader',
    function($scope, $http, $stateParams, $location, Global, Articles, FileUploader) {
        $scope.global = Global;
        $scope.formTitle = {title: null};
        $scope.uploader = new FileUploader({ 
            url: '/articles/asbuilt',
            alias: 'title',
            method: 'POST',
            removeAfterUpload: true,
            isUploading: true
            
        });

        $scope.surveyUploader = new FileUploader({ 
            url: '/survey',
            alias: 'title',
            method: 'POST',
            removeAfterUpload: true,
            isUploading: true
            
        });

        $scope.updateAlias = function (data){
            console.log(data);
            if (data){
                $scope.uploader.alias = data;
                $scope.surveyUploader.alias = data;
                $scope.formTitle.title = data;
            }
            else{
                $scope.uploader.alias = 'temp';
                $scope.surveyUploader.alias = 'temp';
            }
        };

        $scope.uploader.filters.push({
            name: 'imageFilter',
            fn: function(item /*{File|FileLikeObject}*/, options) {
                var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                return '|pdf|PDF|txt|TXT|csv|CSV'.indexOf(type) !== -1;
            }
        });
        // $scope.surveyUploader.filters.push({
        //     name: 'imageFilter',
        //     fn: function(item /*{File|FileLikeObject}*/, options) {
        //         var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
        //         return '|csv|CSV'.indexOf(type) !== -1;
        //     }
        // });
        $scope.hasAuthorization = function(article) {
            if (!article || !article.user) return false;
            return $scope.global.isAdmin || article.user._id === $scope.global.user._id;
        };

        $scope.getFileNames = function (queue){
            var files = [];
            for (var each in queue){
                if (queue[each].file.name !== undefined){
                    files.push(queue[each].file.name);
                }
            }
            return files;
        };

       
        $scope.create = function(isValid) {
            if (isValid) {
                var article = new Articles({
                    title: $scope.formTitle.title,
                    content: this.content,
                    path: $scope.getFileNames($scope.uploader.queue),
                    transaction: this.transaction,
                    subdivision: this.subdivision
                });
                article.$save(function(response) {
                    $location.path('articles/' + response._id);
                    $scope.uploader.url = $location.path('articles/' + response._id);
                });

                this.title = '';
                this.content = '';
            } else {
                $scope.submitted = true;
            }
            $scope.uploader.uploadAll();
            $scope.surveyUploader.uploadAll();
        };

        $scope.remove = function(article) {
            if (article) {
                article.$remove();

                for (var i in $scope.articles) {
                    if ($scope.articles[i] === article) {
                        $scope.articles.splice(i, 1);
                    }
                }
            } else {
                $scope.article.$remove(function(response) {
                    $location.path('articles');
                });
            }
        };

        $scope.update = function(isValid) {
            if (isValid) {
                var article = $scope.article;
                if (!article.updated) {
                    article.updated = [];
                }
                article.updated.push(new Date().getTime());

                article.$update(function() {
                    $location.path('articles/' + article._id);
                });
            } else {
                $scope.submitted = true;
            }
        };

        $scope.find = function() {
            Articles.query(function(articles) {
                $scope.articles = articles;
            });
        };

        $scope.findOne = function() {
            Articles.get({
                articleId: $stateParams.articleId
            }, function(article) {
                $scope.article = article;
            });
        };
    }

]);


angular.module('mean').directive('ngThumb', ['$window', function($window) {
        var helper = {
            support: !!($window.FileReader && $window.CanvasRenderingContext2D),
            isFile: function(item) {
                return angular.isObject(item) && item instanceof $window.File;
            },
            isImage: function(file) {
                var type =  '|' + file.type.slice(file.type.lastIndexOf('/') + 1) + '|';
                return '|jpg|png|jpeg|bmp|gif|JPG|'.indexOf(type) !== -1;
            }
        };

        return {
            restrict: 'A',
            template: '<canvas/>',
            link: function(scope, element, attributes) {
                if (!helper.support) return;

                var params = scope.$eval(attributes.ngThumb);
                console.log(params);

                if (!helper.isFile(params.file)) return;
               
                if (!helper.isImage(params.file)) return;
				alert('Made it');

                var canvas = element.find('canvas');
                var reader = new FileReader();
                reader.onload = onLoadFile;
                reader.readAsDataURL(params.file);

                function onLoadFile(event) {
                    var img = new Image();
                    img.onload = onLoadImage;
                    img.src = event.target.result;
                }

                function onLoadImage() {
                    var width = params.width || this.width / this.height * params.height;
                    var height = params.height || this.height / this.width * params.width;
                    canvas.attr({ width: width, height: height });
                    canvas[0].getContext('2d').drawImage(this, 0, 0, width, height);
                }
            }
        };
    }]);
