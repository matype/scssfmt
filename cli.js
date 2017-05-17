#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const stdin = require('stdin')
const pkg = require('./package.json')
const tidify = require('./')

const minimist = require('minimist')
const argv = minimist(process.argv.slice(2), {
  boolean: [
    'help',
    'version'
  ],
  alias: {
    d: 'diff',
    h: 'help',
    r: 'recursive',
    v: 'version',
  }
})

const postcss = require('postcss')
const scss = require('postcss-scss')
const chalk = require('chalk')
const JsDiff = require('diff')
const chokidar = require('chokidar')


if (argv.v) {
  console.log(pkg.version)
  process.exit()
}

if (argv.h) {
  console.log('Usage: tidify [options] input-name [output-name]')
  console.log('')
  console.log('Options:')
  console.log('')
  console.log('  -d, --diff             Output diff against original file')
  console.log('  -r, --recursive        Format list of space seperated files(globs) in place')
  console.log('  -w, --watch            Watch directories or files')
  console.log('  -v, --version          Output the version number')
  console.log('  -h, --help             Output usage information')
  console.log('  --stdin-filename       A filename to assign stdin input.')
  process.exit()
}


let options = {}

if (argv.r) {
  const globby = require('globby')
  globby([path.join(argv.r)].concat(argv._)).then(processMultipleFiles)
} else if (argv.w) {
  let watcher = chokidar.watch(argv.w, {
    ignoreInitial: true
  })
  let log = console.log.bind(console)
  const format = filePath => {
    const fullPath = path.resolve(process.cwd(), filePath)
    const css = fs.readFileSync(fullPath, 'utf-8')
    const formatted = tidify(css)
    if (css !== formatted) {
      fs.writeFileSync(fullPath, formatted)
      return true
    }
    return false
  }
  watcher
    .on('add', filePath => {
      if (format(filePath)) {
        log(chalk.yellow(`Added ${filePath} file has been formatted`))
      }
    })
    .on('change', filePath => {
      if (format(filePath)) {
        log(chalk.green(`Changed ${filePath} file has been formatted`))
      }
    })
} else if (argv._[0]) {
  const input = argv._[0]
  const fullPath = path.resolve(process.cwd(), input)
  const output = argv._[1] || argv._[0]

  const css = fs.readFileSync(fullPath, 'utf-8')

  postcss([tidify()])
    .process(css, {
      from: fullPath,
      syntax: scss
    })
    .then(result => {
      const formatted = result.css
      if (argv.d) {
        console.log(handleDiff(input, css, formatted))
      } else {
        if (css !== formatted) {
          fs.writeFile(output, formatted, err => {
            if (err) {
              throw err
            }
          })
        }
      }
    })
} else {
  stdin(css => {
    options.codeFilename = argv['stdin-filename']
    postcss([tidify()])
      .process(css, {
        from: options.codeFilename,
        syntax: scss
      })
      .then(result => process.stdout.write(result.css))
  })
}


function processMultipleFiles (files) {
  files = files.filter(isTargetFile).sort()
  if (!files.length) {
    console.error("Files glob patterns specified did not match any css files.")
    return
  }

  Promise.all(files.map(file => {
    const fullPath = path.resolve(process.cwd(), file)
    const css = fs.readFileSync(fullPath, 'utf-8')
    return postcss([tidify()])
      .process(css, {
        from: fullPath,
        syntax: scss
      })
      .then(result => {
        const formatted = result.css
        if (argv.d) {
          return handleDiff(file, css, formatted)
        } else if (css !== formatted) {
          fs.writeFile(fullPath, formatted, err => {
            if (err) {
              throw err
            }
          })
          return file
        }
      })
  })).then(messages => {
    if (argv.d) {
      console.log(messages.join('\n\n'))
    } else {
      messages = messages.filter(file => {
        return file
      })
      if (messages.length){
        messages = messages.join(', ') + '\n\n' + messages.length
      } else {
        messages = 'No'
      }
      console.log(messages + ' files are formatted.')
    }
  })
}


function isTargetFile (filePath) {
  return /^\.css|\.scss$/i.test(path.extname(filePath))
}


function handleDiff (file, original, formatted) {
  let diff
  if (original === formatted) {
    diff = 'There is no difference with the original file.'
  }

  if (chalk.supportsColor) {
    file = chalk.blue(file)
    if (diff) {
      diff = chalk.gray(diff)
    } else {
      diff = JsDiff.createPatch(file, original, formatted)
      diff = diff.split('\n').splice(4).map(line => {
        if (line[0] === '+') {
          line = chalk.green(line)
        } else if (line[0] === '-') {
          line = chalk.red(line)
        } else if (line.match(/^@@\s+.+?\s+@@/) || '\\ No newline at end of file' === line) {
          line = ''
        }
        return chalk.gray(line)
      })
      diff = diff.join('\n').trim()
    }
  } else if (!diff) {
    diff = formatted
  }
  return file + '\n' + diff
}
