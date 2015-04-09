# gulp-htmllint

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
		.pipe(htmllint());
});
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
