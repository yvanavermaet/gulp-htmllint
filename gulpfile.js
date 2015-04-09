'use strict';

var gulp = require('gulp'),
	jscs = require('gulp-jscs'),
	jscsStylish = require('gulp-jscs-stylish'),
	jshint = require('gulp-jshint');

// default task
gulp.task('default', function() {
	return gulp.src('src/**/*.js')
		.pipe(jshint())
		.pipe(jscs())
		.on('error', function() {})
		.pipe(jscsStylish.combineWithHintResults())
		.pipe(jshint.reporter('jshint-stylish'));
});
