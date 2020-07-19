'use strict';

/* eslint-disable no-empty-function */

var gulp = require('gulp'),
	eslint = require('gulp-eslint'),
	gulpMocha = require('gulp-mocha');

// lint
gulp.task('lint', function() {
	return gulp.src(['./src/**/*.js', './test/**/*.js', './gulpfile.js'])
		.pipe(eslint())
		.on('error', function() {})
		.pipe(eslint.format())
		.pipe(eslint.failAfterError());
});




// travis
gulp.task('test', gulp.series('lint', function runMocha() {
	return gulp.src('./test/**/*.js')
		.pipe(gulpMocha())
		.on('error', function() {});
}));



// default task
gulp.task('default', gulp.series('lint'));
