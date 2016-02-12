var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    jshint = require('gulp-jshint'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    watch = require('gulp-watch'),
    livereload = require('gulp-livereload'),
    plumber = require('gulp-plumber'),
    basePath = ['assets'],
    scssPath = ['assets/scss'],
    cssPath = 'assets/css',
    bowerPath = ['assets/bower_components'];



gulp.task('sass', function () {
    return gulp.src(scssPath + '/*.scss')
        .pipe(sourcemaps.init())
        .pipe(plumber()) // prevents compilation errors from killing gulp
        .pipe(sass({
            outputStyle: 'compressed',
            includePaths: bowerPath + '/bootstrap-sass/assets/stylesheets'
        }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(cssPath))
        .pipe(livereload());
});


gulp.task('watch', function () {
    livereload.listen();
    gulp.watch(scssPath + '/**/*.scss', ['sass']);
    //gulp.watch(appPath + '/**/*.js', ['js']);
});


gulp.task('vendor', function () {
    return gulp.src([
            bowerPath + '/d3/d3.min.js',
            bowerPath + '/topojson/topojson.js',
            bowerPath + '/datamaps/dist/datamaps.usa.min.js',
])
        .pipe(sourcemaps.init())
        .pipe(plumber())
        .pipe(concat('plugins.js'))
        .pipe(uglify({
            mangle: true
        }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(basePath + '/dist'));
});


gulp.task('js', function () {
    return gulp.src([
        appPath + '/app.module.js',
        appPath + '/app.views.js',
    ])
        .pipe(sourcemaps.init())
        .pipe(plumber())
        .pipe(concat('app.js'))
        .pipe(ngAnnotate({
            add: true,
            single_quotes: true
        }))
        .pipe(uglify({
            mangle: true
        }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(basePath + '/dist'));
})


gulp.task('lint', function () {
    gulp.src([appPath + '/**/*.js'])
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});


// Default Task
gulp.task('default', ['sass', 'watch']);
gulp.task('build', ['lint', 'vendor']);
