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
});
