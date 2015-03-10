var gulp = require('gulp');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var clean = require('gulp-clean');
var browserSync = require('browser-sync');
var reload = browserSync.reload;

var files = [
  './src/*.js'
];

gulp.task('clean', function () {
  gulp.src('./example/ngSync.min.js')
      .pipe(clean());
});

gulp.task('lint', function () {
  gulp.src(files)
      .pipe(jshint())
      .pipe(jshint.reporter('default'));
});

gulp.task('dist', function () {
  gulp.src(files)
      .pipe(uglify())
      .pipe(rename('ngSync.min.js'))
      .pipe(gulp.dest('./example'));
});

gulp.task('default', ['clean', 'lint', 'dist'], function () {

  browserSync({
      server: "./example"
  });

  gulp.watch(files, ['clean', 'lint', 'dist']).on('change', reload);

  gulp.watch('./example/*.html').on('change', reload);

});
