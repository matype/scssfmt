const os = require('os')
const postcss = require('postcss')
const scss = require('postcss-scss')

const NEW_LINE = os.EOL, NO_SPACES = '', ONE_SPACE = ' ', TWO_SPACES = '  '
const isCustomProperty = prop => prop.slice(0, 2) === '--'
const isSassVal = prop => /^\$/.test(prop)
const hasPlusInsideParens = selector => /\(.+\+.+\)/.test(selector)
const isAttrSelector = selector => /\[.+\]/.test(selector)
const isOneLinearRule = rule => rule.nodes.length === 1 && rule.nodes[0].type === 'decl' && !rule.nodes[0].raws.before.match(/\n/) && !rule.raws.after.match(/\n/) && !rule.raws.between.match(/\n/) && rule.selectors.length === 1
const countNewLine = str => str.split(NEW_LINE).length - 1
const getIndent = node => TWO_SPACES.repeat(getDepth(node))

const getDepth = node => {
  let parent = node.parent
  let num = 0
  while (parent.type !== 'root') { parent = parent.parent; num++ }
  return num
}

const getNodeBefore = (node, indentation) => {
  let nodeBefore = node.type === 'decl' ? NEW_LINE + indentation : NO_SPACES
  if (node.prev() || node.parent.type !== 'root') {
    node.type !== 'decl' && (nodeBefore = NEW_LINE + indentation)
    const nlCount = countNewLine(node.raws.before)
    nlCount && (nodeBefore = NEW_LINE.repeat(nlCount) + indentation)
  }
  return nodeBefore
}

const plugin = postcss.plugin('scssfmt', _ => root => {
  root.walkRules(rule => {
    const indentation = getIndent(rule)
    isOneLinearRule(rule) && (rule.onelinear = true)
    rule.raws.before = getNodeBefore(rule, indentation)
    rule.raws.between = ONE_SPACE
    rule.raws.semicolon = true
    rule.raws.after = isOneLinearRule(rule) ? ONE_SPACE : NEW_LINE + indentation
    if (rule.raws.selector) rule.selector = rule.raws.selector.raw
    else {
      let tmp = [], selector
      const separator = `,${NEW_LINE}` + indentation
      rule.selectors.forEach(selector => {
        selector = !hasPlusInsideParens(selector) && !isAttrSelector(selector) ? selector.replace(/\s*([+~>])\s*/g, " $1 ").trim() : isAttrSelector(selector) && selector.replace(/\[\s*(\S+)\s*\]/g, "[$1]")
        tmp.push(selector)
      })
      rule.selector = tmp.join(separator)
    }
  })

  root.walkDecls(decl => {
    decl.raws.value && (decl.raws.value.raw = decl.raws.value.raw.trim())
    decl.raws.before = decl === root.first ? NO_SPACES : getNodeBefore(decl, getIndent(decl))
    decl.raws.between = `:${ONE_SPACE}`
    decl.parent.type === 'rule' && decl.parent.onelinear && (decl.raws.before = ONE_SPACE)
    decl.raws.important && (decl.raws.important = `${ONE_SPACE}!important`)
  })

  root.walkAtRules(atrule => {
    const indentation = getIndent(atrule)
    atrule.raws.before = atrule.name === 'else' ? atrule.raws.before : getNodeBefore(atrule, indentation)
    atrule.raws.after = NEW_LINE + indentation
    atrule.raws.between = atrule.nodes ? ONE_SPACE : NO_SPACES
    atrule.raws.afterName = atrule.params ? ONE_SPACE : NO_SPACES
    atrule.raws.semicolon !== undefined && (atrule.raws.semicolon = true)
  })
})

module.exports = (css, options = { syntax: scss }) => postcss([plugin()]).process(css, options).css
module.exports.plugin = plugin
