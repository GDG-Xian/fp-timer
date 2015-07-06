var gulp       = require('gulp');
var gulpif     = require('gulp-if');
var clean      = require('gulp-clean');
var jshint     = require('gulp-jshint');
var uglify     = require('gulp-uglify');
var sass       = require('gulp-sass');
var minifycss  = require('gulp-minify-css');
var browserify = require('gulp-browserify');
var watch      = require('gulp-watch');
var files      = require('./files');
var production = true;

gulp.task('dev', function() {
  production = false;
});

gulp.task('clean', function() {
  return gulp.src('./build/*', { read: false })
    .pipe(clean({ force: true }));
});

gulp.task('scripts', ['jshint'], function() {
  gulp.src(files.scripts)
    .pipe(browserify({ debug: !production }))
    .pipe(gulpif(production, uglify({ mangle: false })))
    .pipe(gulp.dest('./build/scripts'));
});

gulp.task('jshint', function() {
  gulp.src(files.scriptsAll)
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('styles', function() {
  gulp.src(files.styles)
    .pipe(sass())
    .pipe(gulpif(production, minifycss()))
    .pipe(gulp.dest('./build/styles/'));
});

gulp.task('copy', function() {
  gulp.src(files.static, { base: './src' })
    .pipe(gulp.dest('./build/'));
});

gulp.task('watch', ['dev', 'build'], function() {
  gulp.watch(files.static, ['copy']);
  gulp.watch(files.scriptsAll, ['scripts']);
  gulp.watch(files.stylesAll,  ['styles']);
});

gulp.task('build', ['copy', 'scripts', 'styles']);