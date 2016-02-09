var gulp = require('gulp');
var gutil = require('gulp-util');
var gulpif = require('gulp-if');
var cssnano = require('gulp-cssnano');
var less = require('gulp-less');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var del = require('del')
var manifest = require('./manifest.json');
var util = require('util');
var zip = require('gulp-zip');

var isToUglify = false;

var unpackagedFolder = 'dist';
var packageFolder = 'release';

gulp.task('uglify_on', function() {
  isToUglify = true;
})

gulp.task('scripts', function() {
  return gulp.src([
      'node_modules/jsuri/Uri.js',
      'scripts/*.js'
    ])
    .pipe(gulpif(isToUglify, uglify({
      mangle: false
    })))
    .pipe(gulp.dest(unpackagedFolder + '/scripts'));
});

gulp.task('locales', function() {
  return gulp.src(['_locales/**/messages.json'], {
      base: './'
    })
    .pipe(gulp.dest(unpackagedFolder))
});

gulp.task('media', function() {
  return gulp.src(['media/**/*.*'], {
      base: './'
    })
    .pipe(gulp.dest(unpackagedFolder))
})

gulp.task('styles', function() {
  return gulp.src(['stylesheets/*.less'], {
      base: './'
    })
    .pipe(less())
    .pipe(gulpif(isToUglify, cssnano()))
    .pipe(gulp.dest(unpackagedFolder));
});

gulp.task('html', function() {
  return gulp.src(['html/**/*.html'], {
      base: './'
    })
    .pipe(gulp.dest(unpackagedFolder));
})

gulp.task('manifest', function() {
  return gulp.src('manifest.json')
    .pipe(gulp.dest(unpackagedFolder));
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

// watches changes and move files to 'unpackagedFolder' folder for the
// extension to be ran as 'unpacked extension' from chrome
gulp.task('default', ['watch']);

// moves all files to 'unpackedFolder'
gulp.task('unpackage', ['clean', 'manifest', 'scripts', 'html', 'media', 'styles', 'locales']);

// same as 'unpackage' but minifies .js and .css files first
gulp.task('unpackage_uglify', ['uglify_on', 'unpackage']);

// moves all files to 'unpackedFolder' folder and creates a .zip package from it on 'packageFolder' folder
// zip file is named after manifest.json version property
gulp.task('package', ['uglify_on', 'unpackage'], function() {
  return gulp.src(unpackagedFolder + '/**/*.*')
    .pipe(zip('iZoom-' + manifest.version + '.zip'))
    .pipe(gulp.dest(packageFolder));
});
