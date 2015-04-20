'use strict';

var gulp = require('gulp'),
	eslint = require('gulp-eslint');

// lint
gulp.task('lint', function() {
	return gulp.src([
			'./src/**/*.js',
			'./test/**/*.js',
			'./gulpfile.js'
		])
		.pipe(eslint())
		.on('error', function() {})
		.pipe(eslint.format())
		.pipe(eslint.failAfterError());
});

// default task
gulp.task('default', ['lint'], function() {});
