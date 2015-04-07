'use strict';

var fs = require('fs'),
	gutil = require('gulp-util'),
	htmllint = require('htmllint'),
	through = require('through2');

var htmllintPlugin = function(options) {
	if (typeof options === 'undefined') {
		options = {};
	}

	var configPath = options.config || '.htmllintrc',
		out = [];

	if (fs.existsSync(configPath)) {
		options = JSON.parse(fs.readFileSync(configPath, 'utf8'));
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

		var lint = htmllint(file.contents.toString(), options);

		lint.then(function(issues) {
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

module.exports = htmllintPlugin;
