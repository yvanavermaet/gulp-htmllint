'use strict';

var fs = require('fs'),
	gutil = require('gulp-util'),
	htmllint = require('htmllint'),
	through = require('through2');

module.exports = function(options) {
	var configPath, plugins,
		htmllintOptions = {},
		out = [];

	if (typeof options === 'undefined') {
		options = {};
	}

	configPath = options.config || '.htmllintrc';
	plugins = options.plugins || [];

	// load htmllint rules
	if (fs.existsSync(configPath)) {
		htmllintOptions = JSON.parse(fs.readFileSync(configPath, 'utf8'));
	}

	// use plugins
	htmllint.use(plugins);

	if (options.maxerr) {
		htmllintOptions.maxerr = options.maxerr;
	}

	return through.obj(function(file, enc, cb) {
		if (file.isNull()) {
			cb(null, file);

			return;
		}

		if (file.isStream()) {
			cb(new gutil.PluginError('gulp-htmllint', 'Streaming not supported'));

			return;
		}

		htmllint(file.contents.toString(), htmllintOptions).then(function(issues) {
			if (issues.length > 0) {
				out.push('\n' + file.path);
			}

			issues.forEach(function(issue) {
				out.push(gutil.colors.red('line ' + issue.line + '\tcol ' + issue.column + '\t' + (issue.msg || htmllint.messages.renderIssue(issue)) + ' (' + issue.code + ')'));
			});
		});

		cb(null, file);
	}, function(cb) {
		if (out.length > 0) {
			gutil.log(out.join('\n'));
		}

		cb();
	});
};
