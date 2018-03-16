'use strict';

var issues = require('./fixtures/issues.json'),
	filepath = '/some/path/to/html',
	expect = require('chai').expect;

describe('default-reporter', function() {
	var defaultReporter = require('../src/default-reporter').generateOutput;

	it('returns "no errors" message when there are no issues', function(done) {
		var result = defaultReporter('', []);

		expect(result).be.equal('\u001b[1m\u001b[4m\u001b[37m:\u001b[39m\u001b[24m\u001b[22m\n\n\u001b[31mFound0errors\u001b[39m\n');

		return done();
	});

	it('returns formatted error message when issues are given', function(done) {
		var result = defaultReporter(filepath, issues);

		expect(result).to.be.equal('\u001b[1m\u001b[4m\u001b[37m/some/path/to/html:\u001b[39m\u001b[24m\u001b[22m\n\u001b[2m[11:7]\u001b[22m  line ending does not match format: lf                    \u001b[2mline-end-style\u001b[22m\n\u001b[2m[7:13]\u001b[22m  class value must match the format: underscore            \u001b[2mclass-style\u001b[22m\n\u001b[2m[7:7]\u001b[22m   duplicate attribute: class                               \u001b[2mattr-no-dup\u001b[22m\n\u001b[31mFound3errors\u001b[39m\n');

		return done();
	});
});
