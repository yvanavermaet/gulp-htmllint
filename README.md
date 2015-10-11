# gulp-htmllint [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][depstat-image]][depstat-url]

This module is an interface layer for [htmllint](https://github.com/htmllint/htmllint/).

## Install

```sh
$ npm install gulp-htmllint --save-dev
```

## Usage

```js
var gulp = require('gulp'),
	htmllint = require('gulp-htmllint');

gulp.task('default', function() {
	return gulp.src('src/index.html')
		.pipe(htmllint({}, htmllintReporter));
});

function htmllintReporter(file, issues) {
	if (issues.length > 0) {
		issues.forEach(function (issue) {
			gutil.log(gutil.colors.cyan('[gulp-htmllint]') + gutil.colors.red('(' + issue.code + ') ') + gutil.colors.white( file + '[' + issue.line + ', ' + issue.column + ']: ') + gutil.colors.red((issue.msg || htmllint.messages.renderIssue(issue))));
		});

		process.exitCode = 1;
	}
}
```

### Options

#### options.config
Type: `String`
Default value: `.htmllintrc`

Config containing [htmllint options](https://github.com/htmllint/htmllint/wiki/Options).

#### options.plugins
Type: `Array`
Default value: `[]`

An array of strings, each of which should be the name of an htmllint plugin to require and use.

#### options.failOnError
Type: `Boolean`
Default value: false

Boolean value to define if the process should exit with a code of 1 on htmllint errors.

### Custom Reporter

The custom reporter is a function which accepts 2 parameters: filepath and an array of issues as returned by the htmlling-plugin.

[npm-url]: https://www.npmjs.com/package/gulp-htmllint
[npm-image]: https://badge.fury.io/js/gulp-htmllint.svg
[travis-url]: https://travis-ci.org/yvanavermaet/gulp-htmllint
[travis-image]: https://img.shields.io/travis/yvanavermaet/gulp-htmllint.svg?branch=master
[depstat-url]: https://david-dm.org/yvanavermaet/gulp-htmllint
[depstat-image]: https://david-dm.org/yvanavermaet/gulp-htmllint.svg
