'use strict';

var fs = require('fs'),
	gutil = require('gulp-util'),
	htmllint = require('htmllint'),
	through = require('through2');

module.exports = function(options, reporter) {
	var configPath, plugins,
		htmllintOptions = {},
		out = [];

	if (typeof options === 'undefined') {
		options = {};
	}

	configPath = options.config || '.htmllintrc';
	plugins = options.plugins || [];

	if (options.rules) {
		htmllintOptions = options.rules;
	} else {
		// load htmllint rules
		if (fs.existsSync(configPath)) {
			htmllintOptions = JSON.parse(fs.readFileSync(configPath, 'utf8'));
		}
	}

	// use plugins
	htmllint.use(plugins);

	if (options.maxerr) {
		htmllintOptions.maxerr = options.maxerr;
	}

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

		lint = htmllint(file.contents.toString(), htmllintOptions);

		lint.then(function(issues) {
			issues.forEach(function(issue) {
				issue.msg = issue.msg || htmllint.messages.renderIssue(issue);
			});

			// Add the property htmllint to the file object
			file.htmllint = {};
			if (issues.length > 0) {
				file.htmllint.success = false;
			} else {
				file.htmllint.success = true;
			}
			file.htmllint.issues = issues;
			cb(null, file);

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
};
