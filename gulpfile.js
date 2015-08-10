var gulp = require('gulp');
var gutil = require('gulp-util');
var gulpif = require('gulp-if');
var cssmin = require('gulp-minify-css');
var less = require('gulp-less');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var del = require('del')

var isDeploy = false;
var releaseFolder = 'dist';

gulp.task('scripts', function() {
  return gulp.src([
      'node_modules/jsuri/Uri.js',
      'scripts/*.js'
    ])
    .pipe(gulpif(isDeploy, uglify({
      mangle: false
    })))
    .pipe(gulp.dest(releaseFolder + '/scripts'));
});

gulp.task('locales', function() {
  return gulp.src(['_locales/**/messages.json'], {
      base: './'
    })
    .pipe(gulp.dest(releaseFolder))
});

gulp.task('media', function() {
  return gulp.src(['media/**/*.*'], {
      base: './'
    })
    .pipe(gulp.dest(releaseFolder))
})

gulp.task('styles', function() {
  return gulp.src(['stylesheets/*.less'], {
      base: './'
    })
    .pipe(less())
    .pipe(gulpif(isDeploy, cssmin()))
    .pipe(gulp.dest(releaseFolder));
});

gulp.task('html', function() {
  return gulp.src(['html/**/*.html'], {
      base: './'
    })
    .pipe(gulp.dest(releaseFolder));
})

gulp.task('manifest', function() {
  return gulp.src('manifest.json')
    .pipe(gulp.dest(releaseFolder));
})

gulp.task('clean', function() {
  del.sync(['dist/*']);
});

gulp.task('watch', function() {

  var cb = function(event) {
    gutil.log(gutil.colors.green('File ' + event.path + ' was ' + event.type + ', running tasks...'));
  };

  gulp.watch(['node_modules/jsuri/Uri.js', 'scripts/*.js'], ['scripts']).on('change', cb);
  gulp.watch('locales/**/messages.json', ['locales']).on('change', cb);
  gulp.watch('media/**/*.*', ['media']).on('change', cb);
  gulp.watch('stylesheets/*.less', ['styles']).on('change', cb);
  gulp.watch('html/**/*.html', ['html']).on('change', cb);
  gulp.watch('manifest.json', ['manifest']).on('change', cb);
});

gulp.task('default', ['watch']);
gulp.task('deploy', ['clean', 'manifest', 'scripts', 'html', 'media', 'styles', 'locales'])
