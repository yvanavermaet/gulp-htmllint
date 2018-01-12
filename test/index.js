'use strict';

/* eslint-disable object-curly-newline, function-paren-newline, no-empty-function */

var expect = require('chai').expect,
	gulp = require('gulp');

describe('gulp-htmllint', function() {
	var htmllint = require('../');

	it('should be a function', function() {
		expect(htmllint).to.be.an.instanceOf(Function);
	});

	it('should return an object', function() {
		var result = htmllint();

		expect(result).to.be.an.instanceOf(Object);
	});

	it('should emit error on streamed file', function(done) {
		gulp.src('test/fixtures/stream.html', {'buffer': false})
			.pipe(htmllint())
			.on('error', function(err) {
				expect(err.message).to.equal('Streaming not supported');

				done();
			});
	});

	it('should throw some errors on file', function(done) {
		gulp.src('test/fixtures/errors.html')
			.pipe(htmllint(
				{
					'failOnError': true
				},
				function reporter() {}
			))
			.on('error', function(err) {
				expect(err.message).to.equal('3 error(s) occurred');
			})
			.on('end', done);
	});

	it('should not throw errors on file', function(done) {
		gulp.src('test/fixtures/clean.html')
			.pipe(htmllint({
				'failOnError': true,
				'rules': {
					'line-end-style': false,
					'class-style': 'bem'
				}
			}))
			.on('end', done);
	});
});
