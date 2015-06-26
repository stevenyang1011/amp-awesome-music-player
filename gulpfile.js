var
    gulp         = require('gulp'),
    less         = require('gulp-less'),
    notify       = require('gulp-notify'),
    sourcemaps   = require('gulp-sourcemaps'),
    livereload   = require('gulp-livereload'),
    uglify      = require('gulp-uglify'),
    concat      = require('gulp-concat'),
    plumber      = require('gulp-plumber'),
    rename      = require('gulp-rename'),
    ngConstant = require('gulp-ng-constant');

var configEnv = 'production';
// CSS
gulp.task('css:vendor', function() {
    return gulp
        .src([
            './bower_components/font-awesome/css/font-awesome.css',
            './bower_components/angular-material/angular-material.css'
        ])
        .pipe(plumber({
            errorHandler: notify.onError(function (error) {
                return 'Error compiling LESS: ' + error.message;
            })
        }))
        .pipe( concat('vendor.css') )
        .pipe(gulp.dest('public/css'))
        .pipe(notify({ message: 'Successfully compiled vendor.css' }));
});

gulp.task('css:app', function() {
    return gulp
        .src('public/src/less/*.less')
        .pipe(plumber({
            errorHandler: notify.onError(function (error) {
                return 'Error compiling LESS: ' + error.message;
            })
        }))
        .pipe(sourcemaps.init())
        .pipe(less({sourceMap: true}))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('public/css'))
        .pipe(notify({ message: 'Successfully compiled app.css' }));
});

//JS
gulp.task('js:vendor', function() {
    return gulp.src([
            // jQuery
            './bower_components/jquery/dist/jquery.js',
            // AngularJS
            './bower_components/angular/angular.js',
            './bower_components/angular-animate/angular-animate.js',
            './bower_components/angular-route/angular-route.js',
            './bower_components/angular-aria/angular-aria.js',
            './bower_components/angular-messages/angular-messages.js',
            //'./bower_components/angular-cookies/angular-cookies.js',
            //'./bower_components/angular-ui-router/release/angular-ui-router.js',
            './bower_components/angular-material/angular-material.js',
            // player
            './bower_components/angular-soundmanager2/dist/angular-soundmanager2.js',
            // Angular storage
            './bower_components/ngstorage/ngStorage.js'
            // Angular UI Utils
            //'./bower_components/angular-ui-utils/ui-utils.js',
            // Angular Translate
            //'./bower_components/angular-translate/angular-translate.js',
            //'./bower_components/angular-translate-loader-url/angular-translate-loader-url.js',
            //'./bower_components/angular-translate-loader-static-files/angular-translate-loader-static-files.js',
            //'./bower_components/angular-translate-storage-local/angular-translate-storage-local.js',
            //'./bower_components/angular-translate-storage-cookie/angular-translate-storage-cookie.js',
            // oclazyload
            //'./bower_components/oclazyload/dist/ocLazyLoad.js',
            // UI Bootstrap
            //'./bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
            // Loading Bar
            //'./bower_components/angular-loading-bar/build/loading-bar.js',
            //datetimepicker
            //'./bower_components/bootstrap-ui-datetime-picker/dist/datetime-picker.js'
        ])
        .pipe(plumber({
            errorHandler: notify.onError(function (error) {
                return 'Error compiling JS vendor.js: ' + error.message;
            })
        }))
        .pipe( concat('vendor.js') )
        //.pipe( uglify() )
        .pipe(gulp.dest('public/js'))
        .pipe(notify({ message: 'Successfully JS vendor.js' }));
    ;
});

//Compile AngularJS configuration
gulp.task('constants', function () {
    var ampConfig = require('./public/src/js/ampConfig.json');
    var envConfig = ampConfig[configEnv];
    return ngConstant({
        name: 'ampConfig',
        constants: envConfig,
        stream: true
    })
        .pipe(rename('ampConfig.js'))
        .pipe(gulp.dest('./public/src/js'));
});

gulp.task('js:app', function() {
    return gulp.src('public/src/js/*.js')
        .pipe(plumber({
            errorHandler: notify.onError(function (error) {
                return 'Error compiling JS app.js: ' + error.message;
            })
        }))
        .pipe( concat('app.js') )
        //.pipe( uglify() )
        .pipe(gulp.dest('public/js'))
        .pipe(notify({ message: 'Successfully JS app.js' }));
    ;
});

// Default task
gulp.task('default', ['css:vendor', 'css:app', 'js:vendor', 'js:app']);

// Watch
gulp.task('watch', function() {
    // Watch .less files
    gulp.watch('public/src/less/*.less', ['css:app']);
    // Watch .less files
    gulp.watch('public/src/js/*.js', ['js:app']);
    livereload.listen();
    gulp.watch(['public/css/**/*']).on('change', livereload.changed);

});