> Standard SCSS code formatter

<div align="center" style="margin:30px 0">
  <a href="https://github.com/morishitter/scssfmt">
    <img width=360px src="http://scssfmt.com/logo.svg">
  </a>
</div>
<br>

<p align="center">
  <a href="https://travis-ci.org/morishitter/scssfmt">
    <img src="https://camo.githubusercontent.com/e688e140da51d197ac1230acf711eb12f85f70be/68747470733a2f2f7472617669732d63692e6f72672f6d6f7269736869747465722f73637373666d742e737667" alt="Build Status" data-canonical-src="https://travis-ci.org/morishitter/scssfmt.svg" style="max-width:100%;">
  </a>
  <a href="https://www.npmjs.com/package/scssfmt">
    <img src="https://img.shields.io/npm/v/scssfmt.svg?style=flat-square" alt="NPM Version">
  </a>
  <a href="https://david-dm.org/morishitter/stylefmt">
    <img src="https://david-dm.org/morishitter/scssfmt.svg"
        alt="Dependency Status">
  </a>
  <a href="https://opensource.org/licenses/MIT">
    <img src="https://img.shields.io/badge/license-MIT-444444.svg?style=flat-square"
        alt="License">
  </a>
</p>

## Installation

```
$ npm install scssfmt
```

Install to global (If you install scssfmt global, you can use it easily in CLI):

```
$ npm install -g scssfmt
```

## Usage

### in Command Line

Simple usage:

```
$ scssfmt input.css output.css
```

#### `--watch`

Watch one file:

```
$ scssfmt --watch input.css
```

Watch multiple files by glob:

```
$ scssfmt --watch 'app/assets/stylesheets/**/*.scss'
```

with `--ignore` option:

```
$ scssfmt --watch 'app/assets/stylesheets/**/*.scss' --ignore app/assets/stylesheets/ignore.css
```

also can use specify multiple files by glob:

```
$ scssfmt --watch 'app/assets/stylesheets/**/*.scss' --ignore 'app/assets/stylesheets/ignore/**/*'
```

#### `--recursive`

Format multiple files by glob:

```
$ scssfmt --recursive 'app/assets/stylesheets/**/*.scss'
```

#### `--diff`

Show diff (don't change code):

```
$ scssfmt input.css --diff
```

#### `--help`

CLI help:

```
$ scssfmt --help
```

```
Usage: scssfmt [options] input-name [output-name]

Options:

  -w, --watch            Watch directories or files
  -d, --diff             Output diff against original file
  -r, --recursive        Format list of space seperated files(globs) in place
  -v, --version          Output the version number
  -h, --help             Output usage information
  --stdin-filename       A filename to assign stdin input.
```

#### Use stdin as inputs

scssfmt can also read a file from stdin if there are no input-file as argument in CLI.

```
$ cat input.css | scssfmt --stdin-filename input.css
```

### Node.js

```js
const fs = require('fs')
const scssfmt = require('scssfmt')

const css = fs.readFileSync('example.css', 'utf-8')
const formatted = scssfmt(css)
```

### PostCSS plugin

```js
const fs = require('fs')
const scssfmt = require('scssfmt')

const css = fs.readFileSync('example.css', 'utf-8')
postcss([scssfmt.plugin()])
  .process(css, {syntax: scss})
  .then(result => {
    const formatted = result.css
  })
```

## Rules for formatting

- 2 spaces indentation
- require 1 space between a simple selector and combinator
- require new line between selectors
- require 1 space between selectors and `{`
- require new line after `{`
- disallow any spaces between property and `:`
- require 1 space between `:` and values
- require a new line after declarations at least
- require `;` in last declaration
- require 1 space between values and `!important`
- Do not format any spaces between rules
- Do not format any spaces between a rule and a comment
- require 1 space between a value and `!important`
- require 1 space between `@mixin` and mixin name
- require 1 space between mixin name and `(`
- require 1 space between `@extend` and base rules
- require 1 space between `@include` and mixin name
- disallow any spaces between `$variable` and `:`
- require 1 space between `:` and name of variable
- Do not format any spaces before `@else`

## Examples

See [tests](https://github.com/morishitter/scssfmt/tree/master/test/fixtures).

## License

The MIT License (MIT)

Copyright (c) 2017 Masaaki Morishita
