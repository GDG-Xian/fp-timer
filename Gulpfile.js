var gulp = require('gulp');
var browserify = require('gulp-browserify');

gulp.task('scripts', function() {
  gulp.src('./src/scripts/*.js')
    .pipe(browserify())
    .pipe(gulp.dest('./build/scripts'));
});
