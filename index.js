const os = require('os')
const postcss = require('postcss')
const scss = require('postcss-scss')

const NEW_LINE = os.EOL
const NO_SPACES = ''
const ONE_SPACE = ' '
const TWO_SPACES = '  '

const getDepth = node => {
  let parent = node.parent
  let num = 0
  while (parent.type !== 'root') {
    parent = parent.parent
    num++
  }
  return num
}

const getNodeBefore = (node, indentation) => {
  let nodeBefore = node.type === 'decl' ? NEW_LINE + indentation : NO_SPACES
  const prev = node.prev()
  if (prev || node.parent.type !== 'root') {
    if (node.type !== 'decl') nodeBefore = NEW_LINE + indentation
    const nlCount = countNewLine(node.raws.before)
    if (nlCount) nodeBefore = NEW_LINE.repeat(nlCount) + indentation
  }
  return nodeBefore
}

const isCustomProperty = prop => prop.slice(0, 2) === '--'
const isSassVal = prop => /^\$/.test(prop)
const hasPlusInsideParens = selector => /\(.+\+.+\)/.test(selector)
const isAttrSelector = selector => /\[.+\]/.test(selector)
const isOneLinearRule = rule => rule.nodes.length === 1 && rule.nodes[0].type === 'decl' && !rule.nodes[0].raws.before.match(/\n/) && !rule.raws.after.match(/\n/) && !rule.raws.between.match(/\n/) && rule.selectors.length === 1
const countNewLine = str => str.split(NEW_LINE).length - 1
const getIndent = node => TWO_SPACES.repeat(getDepth(node))

const plugin = postcss.plugin('scssfmt', () => {
  return root => {
    root.walkRules(rule => {
      const indentation = getIndent(rule)
      if (isOneLinearRule(rule)) {
        rule.onelinear = true
        rule.raws.after = ONE_SPACE
      } else {
        rule.raws.after = NEW_LINE + indentation
      }

      rule.raws.before = getNodeBefore(rule, indentation)
      rule.raws.between = ONE_SPACE
      rule.raws.semicolon = true

      if (rule.raws.selector) {
        rule.selector = rule.raws.selector.raw
      } else {
        let tmp = []
        let selector
        const separator = `,${NEW_LINE}` + indentation
        rule.selectors.forEach(selector => {
          if (!hasPlusInsideParens(selector) && !isAttrSelector(selector)) selector = selector.replace(/\s*([+~>])\s*/g, " $1 ").trim()
          if (isAttrSelector(selector)) selector = selector.replace(/\[\s*(\S+)\s*\]/g, "[$1]")
          tmp.push(selector)
        })
        rule.selector = tmp.join(separator)
      }
    })

    root.walkDecls(decl => {
      const indentation = getIndent(decl)
      const declValue = decl.raws.value
      if (declValue) decl.raws.value.raw = declValue.raw.trim()
      decl.raws.before = decl === root.first ? NO_SPACES : getNodeBefore(decl, indentation)
      decl.raws.between = `:${ONE_SPACE}`
      if (decl.parent.type === 'rule' && decl.parent.onelinear) {
        decl.raws.before = ONE_SPACE
      }
    })

    root.walkAtRules(atrule => {
      const indentation = getIndent(atrule)
      const exception = atrule.name === 'else'
      atrule.raws.before = exception ? atrule.raws.before : getNodeBefore(atrule, indentation)
      atrule.raws.after = NEW_LINE + indentation
      atrule.raws.between = atrule.nodes ? ONE_SPACE : NO_SPACES
      atrule.raws.afterName = atrule.params ? ONE_SPACE : NO_SPACES
      if (atrule.raws.semicolon !== undefined) atrule.raws.semicolon = true
    })
  }
})

const scssfmt = (css, options) => {
  options = options || {}
  options.syntax = scss
  return postcss([plugin()]).process(css, options).css
}

module.exports = scssfmt
module.exports.plugin = plugin
