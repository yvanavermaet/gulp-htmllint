'use strict';

var expect = require('chai').expect;

describe('gulp-htmllint', function() {
	var htmllint = require('../');

	it('should be a function', function() {
		expect(htmllint).to.be.an.instanceOf(Function);
	});

	it('should return an object', function() {
		var result = htmllint();

		expect(result).to.be.an.instanceOf(Object);
	});

	it('should emit a PluginError when appropriate', function(done) {
		var gulp = require('gulp'),
			gutil = require('gulp-util');

		gulp.src('test/fixtures/bad.html')
			.pipe(htmllint({'failOnError': true}, function reporter() {}))
			.on('error', function(error) {
				expect(error).to.be.an.instanceOf(gutil.PluginError);
				done();
			})
			.on('done', done);
	});
});
