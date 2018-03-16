'use strict';

var fs = require('fs'),
	colors = require('ansi-colors'),
	fancyLog = require('fancy-log'),
	PluginError = require('plugin-error'),
	htmllint = require('htmllint'),
	through = require('through2'),
	defaultReporter = require('./default-reporter').report;

function getOptions(options) {
	var htmllintOptions = {},
		configPath = options.config || '.htmllintrc';

	if (options.rules) {
		htmllintOptions = options.rules;
	} else {
		// load htmllint rules
		if (fs.existsSync(configPath)) {
			try {
				htmllintOptions = JSON.parse(fs.readFileSync(configPath, 'utf8'));
			} catch (e) {
				fancyLog(colors.red('Could not process .htmllintrc'));
			}
		}
	}

	if (options.maxerr) {
		htmllintOptions.maxerr = options.maxerr;
	}

	return htmllintOptions;
}

function getPlugins(options) {
	return options.plugins || [];
}

function lintFiles(options, customReporter) {
	var out = [],
		errorCount = 0;

	if (typeof options === 'undefined') {
		options = {};
	}

	// use plugins
	htmllint.use(getPlugins(options));

	function bufferContents(file, enc, cb) {
		var lint;

		if (file.isNull()) {
			cb();

			return;
		}

		if (file.isStream()) {
			this.emit('error', new PluginError('gulp-htmllint', 'Streaming not supported'));
			cb();

			return;
		}

		lint = htmllint(file.contents.toString(), getOptions(options));

		lint.then(function(issues) {
			errorCount += issues.length;

			issues.forEach(function(issue) {
				issue.msg = issue.msg || htmllint.messages.renderIssue(issue);
			});

			// Add the property htmllint to the file object
			file.htmllint = {};
			file.htmllint.success = issues.length === 0;
			file.htmllint.issues = issues;

			if (typeof customReporter === 'function') {
				customReporter(file.path, issues);
			} else {
				defaultReporter(file.path, issues);
			}

			cb();
		}).catch(function(error) {
			out.push('\n' + file.path + '\n' + colors.red(error.toString()));
			cb();
		});
	}

	function endStream(cb) {
		if (out.length > 0) {
			fancyLog(out.join('\n'));
		}

		if (options.failOnError && errorCount > 0) {
			this.emit('error', new PluginError('gulp-htmllint', errorCount + ' error(s) occurred'));
		}

		this.emit('end');
		cb();
	}

	return through.obj(bufferContents, endStream);
}

module.exports = lintFiles;
