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

CLI help:

```
$ tidify --help
```

```
Usage: tidify [options] input-name [output-name]

Options:

  -d, --diff             Output diff against original file
  -r, --recursive        Format list of space seperated files(globs) in place
  -v, --version          Output the version number
  -h, --help             Output usage information
  --stdin-filename       A filename to assign stdin input.
```

Tidify can also read a file from stdin if there are no input-fle as argument in CLI.

```
$ cat input.css | tidify
```

## Examples

See [tests](https://github.com/morishitter/tidify/tree/master/test/fixtures).

## License

The MIT License (MIT)

Copyright (c) 2017 Masaaki Morishita
