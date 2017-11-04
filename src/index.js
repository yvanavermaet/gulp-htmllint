'use strict';

var fs = require('fs'),
	gutil = require('gulp-util'),
	htmllint = require('htmllint'),
	through = require('through2');

function getOptions(options) {
	var htmllintOptions = {},
		configPath = options.config || '.htmllintrc';

	if (options.rules) {
		htmllintOptions = options.rules;
	} else {
		// load htmllint rules
		if (fs.existsSync(configPath)) {
			htmllintOptions = JSON.parse(fs.readFileSync(configPath, 'utf8'));
		}
	}

	if (options.maxerr) {
		htmllintOptions.maxerr = options.maxerr;
	}

	return htmllintOptions;
}

function getPlugins(options) {
	if (options.plugins) {
		return options.plugins;
	}

	return [];
}

function lintFiles(options, reporter) {
	var out = [];

	if (typeof options === 'undefined') {
		options = {};
	}

	// use plugins
	htmllint.use(getPlugins(options));

	return through.obj(function(file, enc, cb) {
		var lint;

		if (file.isNull()) {
			cb(null, file);

			return;
		}

		if (file.isStream()) {
			cb(new gutil.PluginError('gulp-htmllint', 'Streaming not supported'));

			return;
		}

		lint = htmllint(file.contents.toString(), getOptions(options));

		lint.then(function(issues) {
			issues.forEach(function(issue) {
				issue.msg = issue.msg || htmllint.messages.renderIssue(issue);
			});

			// Add the property htmllint to the file object
			file.htmllint = {};
			file.htmllint.success = issues.length === 0;
			file.htmllint.issues = issues;

			if (typeof reporter === 'function') {
				reporter(file.path, issues);
			} else {
				if (issues.length > 0) {
					out.push('\n' + file.path);
				}

				issues.forEach(function(issue) {
					out.push(gutil.colors.red('line ' + issue.line + '\tcol ' + issue.column + '\t' + issue.msg + ' (' + issue.code + ')'));
				});
			}

			cb(null, file);
		}).catch(function(error) {
			out.push('\n' + file.path + '\n' + gutil.colors.red(error.toString()));
		});
	}, function(cb) {
		if (out.length > 0) {
			gutil.log(out.join('\n'));

			if (options.failOnError) {
				process.exitCode = 1;
			}
		}

		cb();
	});
}

module.exports = lintFiles;
