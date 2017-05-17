# Tidify [![Build Status](https://travis-ci.org/morishitter/tidify.svg)](https://travis-ci.org/morishitter/tidify)

Tidify is a fast and simple formatter for CSS and SCSS code.

Tidify can format following code:

- Vanilla CSS
- SCSS syntax of Sass

and Tidify is 3 to 4 times faster than [Stylefmt](https://github.com/morishitter/stylefmt).

Tidify'd code is:

- easier to **write** : never worry about minor formatting concerns while hacking away.
- easier to **read** : when all code looks the same you need not mentally convert others' formatting style into something you can understand.
- easier to **maintain** : mechanical changes to the source don't cause unrelated changes to the file's formatting; diffs show only the real changes.
- **uncontroversial** : never have a debate about spacing or brace position ever again!

## Installation

via npm:

```
$ npm install tidify
```

via yarn:

```
$ yarn add --dev tidify
```

## Usage

### in Command Line

If you install Tidify global, you can use it easily in CLI.

```
$ npm install -g tidify
```

CLI help:

```
$ tidify --help
```

```
Usage: tidify [options] input-name [output-name]

Options:

  -d, --diff             Output diff against original file
  -r, --recursive        Format list of space seperated files(globs) in place
  -w, --watch            Watch directories or files
  -v, --version          Output the version number
  -h, --help             Output usage information
  --stdin-filename       A filename to assign stdin input.
```

Format one file:

```
$ tidify input.css
```

Format multiple files by glob:

```
$ tidify --recursive 'app/assets/stylesheets/**/*.scss'
```

Watch one file:

```
$ tidify --watch input.css
```

Watch multiple files by glob:

```
$ tidify --watch 'app/assets/stylesheets/**/*.scss'
```

Show diff (don't change code):

```
$ tidify input.css --diff
```

Tidify can also read a file from stdin if there are no input-file as argument in CLI.

```
$ cat input.css | tidify --stdin-filename input.css
```

### Node.js

```js
const fs = require('fs')
const tidify = require('tidify')

const css = fs.readFileSync('example.css', 'utf-8')
const formatted = tidify(css)
```

### PostCSS plugin

```js
const fs = require('fs')
const tidify = require('tidify')

const css = fs.readFileSync('example.css', 'utf-8')
postcss([tidify.plugin()])
  .process(css, {syntax: scss})
  .then(result => {
    const formatted = result.css
  })
```

## Examples

See [tests](https://github.com/morishitter/tidify/tree/master/test/fixtures).

## License

The MIT License (MIT)

Copyright (c) 2017 Masaaki Morishita
