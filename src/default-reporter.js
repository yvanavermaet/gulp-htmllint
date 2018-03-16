'use strict';

var colors = require('ansi-colors'),
	cliui = require('cliui'),
	fancyLog = require('fancy-log'),
	UI_WIDTH = 120;

function generateOutput(filepath, issues) {
	var errors,
		header = colors.bold(colors.underline(colors.white(filepath + ':'))),
		footer = colors.red('Found' + issues.length + 'errors'),
		ui = cliui({
			'width': UI_WIDTH
		});

	errors = issues.map(function(issue) {
		var location = colors.dim('[' + issue.line + ':' + issue.column + ']');

		return location + '\t  ' + issue.msg + '\t  ' + colors.dim(issue.rule);
	}).join('\n');

	ui.div(header + '\n' + errors + '\n' + footer + '\n');

	return ui.toString();
}

function report(filepath, issues) {
	if (issues.length > 0) {
		fancyLog(generateOutput(filepath, issues));
		// eslint-disable-next-line no-undef
		process.exitCode = 1;
	}
}

module.exports = {
	'generateOutput': generateOutput,
	'report': report
};
