/* jshint node:true */

'use strict';

var gulp = require('gulp');
var gulpsync = require('gulp-sync')(gulp);
var jshint = require('gulp-jshint');
var jscs = require('gulp-jscs');
var docco = require('gulp-docco');
var compass = require('gulp-compass');
var autoprefixer = require('gulp-autoprefixer');
var plumber = require('gulp-plumber');
var minifycss = require('gulp-minify-css');
var browserSync = require('browser-sync');

var JS_SOURCE = 'js/**/*.js';
var jsFiles = ['gulpfile.js', JS_SOURCE];
var target = {
  sassSrc: 'src/css/sass/**/*.scss',
  cssDest: 'src/css',
  sassFolder: 'src/css/sass',
  cssImg: 'src/images',
  jsDest: 'src/js'
};

// BROWSER SYNC
// ----
// browser-sync task for starting the server.
gulp.task('browser-sync', function() {
  browserSync({
      files: ['src/index.html', 'src/css/**/*.css', 'src/js/**/*.js'],
      server: {
          baseDir: './src/'
      }
  });
});

// COMPASS TASK
// ----

gulp.task('compass', function() {
  gulp.src(target.sassSrc)
      .pipe(plumber())
      .pipe(compass({
          css: target.cssDest,
          sass: target.sassFolder,
          image: target.cssImg
      }))
      .pipe(autoprefixer(
          'last 2 version',
          '> 1%',
          'ie 8',
          'ie 9',
          'ios 6',
          'android 4'
      ))
      .pipe(minifycss())
      .pipe(gulp.dest(target.cssDest));
});

// Test
// ----

gulp.task('jscs', function() {
  return gulp.src(jsFiles)
    .pipe(jscs());
});

gulp.task('jshint', function() {
  return gulp.src(jsFiles)
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jshint.reporter('fail'));
});

gulp.task('test', gulpsync.sync(['jshint', 'jscs']));

// JSDOC
// ----
gulp.task('docs', function() {
  gulp.src(JS_SOURCE)
    .pipe(docco())
    .pipe(gulp.dest('./docs'));
});

gulp.task('watch', function() {
  gulp.watch(target.sassSrc, ['compass']);
});

// default/init task
gulp.task('default', ['docs', 'watch', 'browser-sync']);
