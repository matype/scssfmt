# scssfmt [![Build Status](https://travis-ci.org/morishitter/scssfmt.svg)](https://travis-ci.org/morishitter/scssfmt)

> Fast and Simple SCSS formatter

<div align="center" style="margin:30px 0">
  <a href="https://github.com/morishitter/scssfmt">
    <img width=360px src="http://morishitter.github.io/scssfmt-logo.svg">
  </a>
</div>
<br>

scssfmt is a fast and simple formatter for SCSS syntax of Sass.

scssfmt is 3 to 4 times faster than [stylefmt](https://github.com/morishitter/stylefmt).

## Installation

via npm:

```
$ npm install scssfmt
```

via yarn:

```
$ yarn add --dev scssfmt
```

## Usage

### in Command Line

If you install scssfmt global, you can use it easily in CLI.

```
$ npm install -g scssfmt
```

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

## Examples

See [tests](https://github.com/morishitter/scssfmt/tree/master/test/fixtures).

## License

The MIT License (MIT)

Copyright (c) 2017 Masaaki Morishita
