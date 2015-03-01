var
    gulp         = require('gulp'),
    less         = require('gulp-less'),
    notify       = require('gulp-notify'),
    sourcemaps   = require('gulp-sourcemaps'),
    livereload   = require('gulp-livereload'),
    plumber      = require('gulp-plumber');

// CSS
gulp.task('css', function() {
    var stream = gulp
        .src('public/less/style.less')
        .pipe(plumber({
            errorHandler: notify.onError(function (error) {
                return 'Error compiling LESS: ' + error.message;
            })
        }))
        .pipe(sourcemaps.init())
        .pipe(less({sourceMap: true}))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('public/css'));

    return stream
        .pipe(gulp.dest('public/css'))
        .pipe(notify({ message: 'Successfully compiled LESS' }));
});

// Default task
gulp.task('default', function() {
    gulp.start('css');
});

// Watch
gulp.task('watch', function() {
    // Watch .less files
    gulp.watch('public/less/style.less', ['css']);

    livereload.listen();
    gulp.watch(['public/css/**/*']).on('change', livereload.changed);

});