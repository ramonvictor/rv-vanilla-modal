/* jshint node:true */

'use strict';

var gulp = require('gulp');
var gulpsync = require('gulp-sync')(gulp);
var jshint = require('gulp-jshint');
var jscs = require('gulp-jscs');
var jsdoc = require('gulp-jsdoc');
var compass = require('gulp-compass');
var autoprefixer = require('gulp-autoprefixer');
var plumber = require('gulp-plumber');
var minifycss = require('gulp-minify-css');
var browserSync = require('browser-sync');
var protractor = require('gulp-protractor').protractor;
var path = require('path');
var childProcess = require('child_process');
var express = require('express');
var app = express();
var testServer;

var JS_SOURCE = 'src/js/**/*.js';
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

// Protractor setup
function getProtractorBinary(binaryName) {
  var winExt = /^win/.test(process.platform) ? '.cmd' : '';
  var pkgPath = require.resolve('protractor');
  var dirname = path.dirname(pkgPath);
  var protractorDir = path.resolve(path.join(dirname, '..', 'bin'));
  return path.join(protractorDir, '/' + binaryName + winExt);
}

gulp.task('protractor-install', function(done) {
    childProcess.spawn(getProtractorBinary('webdriver-manager'), ['update'], {
        stdio: 'inherit'
    }).once('close', done);
});

gulp.task('webdriver-start', function() {
  childProcess.spawn(getProtractorBinary('webdriver-manager'), ['start'], {
    stdio: 'inherit'
  });
});

gulp.task('test-server', function() {
  var serverRoot = __dirname + '/src';
  app.use(express.static(serverRoot));

  app.get('*', function(req, res) {
    res.sendFile(serverRoot);
  });

  testServer = app.listen(8080);
});

gulp.task('protractor', function() {
  return gulp.src(['./tests/e2e/*.spec.js'])
   .pipe(protractor({
       configFile: 'tests/protractor.config.js'
   }))
   .on('error', function(e) {
     throw e;
   })
   .on('end', function() {
      if (testServer) {
        testServer.close();
      }
   })
});

gulp.task('test', gulpsync.sync(
  ['jshint', 'jscs', 'test-server', 'protractor']
));

// JSDOC
// ----
var jsdocTmpl = {
  path: 'ink-docstrap',
  systemName: 'rv-vanilla-modal',
  footer: 'Generated with gulp',
  copyright: 'Copyright WebItUp 2014',
  navType: 'vertical',
  theme: 'flatly',
  linenums: true,
  collapseSymbols: false,
  inverseNav: false
};

gulp.task('docs', function() {
  gulp.src(JS_SOURCE)
    .pipe(jsdoc('./docs', jsdocTmpl));
});

gulp.task('watch', function() {
  gulp.watch(target.sassSrc, ['compass']);
});

// default/init task
gulp.task('default', ['docs', 'watch', 'browser-sync']);
