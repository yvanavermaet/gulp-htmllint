# gulp-htmllint [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][depstat-image]][depstat-url]

This module is an interface layer for [htmllint](https://github.com/htmllint/htmllint/).

## Install

```sh
$ npm install gulp-htmllint --save-dev
```

## Usage

```js
var gulp = require('gulp'),
	htmllint = require('gulp-htmllint'),
	fancyLog = require('fancy-log'),
	colors = require('ansi-colors');

gulp.task('default', function() {
	return gulp.src('src/index.html')
		.pipe(htmllint({}, htmllintReporter));
});

function htmllintReporter(filepath, issues) {
	if (issues.length > 0) {
		issues.forEach(function (issue) {
			fancyLog(colors.cyan('[gulp-htmllint] ') + colors.white(filepath + ' [' + issue.line + ',' + issue.column + ']: ') + colors.red('(' + issue.code + ') ' + issue.msg));
		});

		process.exitCode = 1;
	}
}
```

### Options

#### options.rules
Type `Object`
Default value: (will parse `options.config` if not set)

Object containing [htmllint options](https://github.com/htmllint/htmllint/wiki/Options).

#### options.config
Type: `String`
Default value: `.htmllintrc`

Configuration file containing [htmllint options](https://github.com/htmllint/htmllint/wiki/Options).

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

## Results

Add the property htmllint to the file object, which is available to streams that follow the htmllint stream. The property htmllint has the following format:

```js
{
	"success": false, // or true for passing htmllint successfully
	"issues": [] // an array of issues as returned by htmllint
}
```

[npm-url]: https://www.npmjs.com/package/gulp-htmllint
[npm-image]: https://badge.fury.io/js/gulp-htmllint.svg
[travis-url]: https://travis-ci.org/yvanavermaet/gulp-htmllint
[travis-image]: https://img.shields.io/travis/yvanavermaet/gulp-htmllint.svg?branch=master
[depstat-url]: https://david-dm.org/yvanavermaet/gulp-htmllint
[depstat-image]: https://david-dm.org/yvanavermaet/gulp-htmllint.svg
