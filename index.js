const os = require('os')
const postcss = require('postcss')

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
    if (node.type !== 'decl') nodeBefore = NEW_LINE
    const nlCount = countNewLine(node.raws.before)
    if (nlCount) nodeBefore = NEW_LINE.repeat(nlCount) + indentation
  }
  return nodeBefore
}

const isCustomProperty = prop => prop.slice(0, 2) === '--'
const isSassVal = prop => /^\$/.test(prop)
const hasPlusInsideParens = selector => /\(.+\+.+\)/.test(selector)
const isAttrSelector = selector => /\[.+\]/.test(selector)
const countNewLine = str => str.split(NEW_LINE).length - 1
const getIndent = node => TWO_SPACES.repeat(getDepth(node))

module.exports = postcss.plugin('tidify', () => {
  return root => {
    root.walkRules(rule => {
      const indentation = getIndent(rule)
      rule.raws.before = getNodeBefore(rule, indentation)
      rule.raws.between = ONE_SPACE
      rule.raws.after = NEW_LINE + indentation
      rule.raws.semicolon = true

      let tmp = []
      let selector
      const separator = `,${NEW_LINE}` + indentation
      rule.selectors.forEach(selector => {
        if (!hasPlusInsideParens(selector) && !isAttrSelector(selector)) selector = selector.replace(/\s*([+~>])\s*/g, " $1 ").trim()
        if (isAttrSelector(selector)) selector = selector.replace(/\[\s*(\S+)\s*\]/g, "[$1]")
        tmp.push(selector)
      })
      rule.selector = tmp.join(separator)
    })

    root.walkDecls(decl => {
      const indentation = getIndent(decl)
      const declValue = decl.raws.value
      if (declValue) decl.raws.value.raw = declValue.raw.trim()
      decl.raws.before = decl === root.first ? NO_SPACES : getNodeBefore(decl, indentation)
      decl.raws.between = ': '
    })

    root.walkAtRules(atrule => {
      const indentation = getIndent(atrule)
      const exception = atrule.name === 'else'
      atrule.raws.before = exception ? atrule.raws.before : getNodeBefore(atrule, indentation)
      atrule.raws.after = NEW_LINE + indentation
      atrule.raws.between = atrule.nodes ? ONE_SPACE : NO_SPACES
      atrule.raws.afterName = atrule.params ? ONE_SPACE : NO_SPACES
    })
  }
})
