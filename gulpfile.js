var gulp = require('gulp'),
    Filter = require('gulp-filter'),
    concat = require('gulp-concat'),
    stylus = require('gulp-stylus');


gulp.task('css', function () {
    var filter = Filter(['src/css/*.styl']);

    return gulp.src('src/css/**/*.styl')
        .pipe(stylus({
            compress: false
        }))
        .pipe(concat('tablemaker.css'))
        .pipe(gulp.dest('build/'));
});

gulp.task('js', function () {
    var filter = Filter(['src/js/*.js']);

    return gulp.src('src/js/**/*.js')
        .pipe(concat('tablemaker.js'))
        .pipe(gulp.dest('build/'));
});

gulp.task('html', function () {
    var filter = Filter(['src/html/*.html']);

    return gulp.src('src/html/**/*.html')
        .pipe(concat('tablemaker.html'))
        .pipe(gulp.dest('build/'));
});


gulp.task('default',['js', 'css', 'html'], function () {
    var watcher = gulp.watch(['src/css/**/*.styl', 'src/js/**/*.js', 'src/html/**/*.html'], ['css','js','html']);
    watcher.on('change', function(event) {
    });  
});