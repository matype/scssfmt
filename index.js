const postcss = require('postcss')
const scss = require('postcss-scss')

const isCustomProperty = prop => prop.slice(0, 2) === '--'
const isSassVal = prop => /^\$/.test(prop)
const hasPlusInsideParens = selector => /\(.+\+.+\)/.test(selector)
const isAttrSelector = selector => /\[.+\]/.test(selector)

const getIndent = node => {
  const indentWidth = '  '
  const nestedNum = getDepth(node)
  const indentation = indentWidth.repeat(nestedNum)
  return indentation
}

const getDepth = node => {
  let parent = node.parent
  let num = 0
  while (parent.type !== 'root') {
    parent = parent.parent
    num++
  }
  return num
}

const getRuleBefore = (rule, indentation) => {
  let ruleBefore = ''
  const prev = rule.prev()
  if (prev || rule.parent.type !== 'root') {
    ruleBefore = '\n'
    const nlCount = (rule.raws.before || '').split('\n').length - 1
    if (nlCount) {
      ruleBefore = '\n'.repeat(nlCount) + indentation
    }
  }
  return ruleBefore
}

module.exports = postcss.plugin('stylefmt', () => {
  return root => {
    root.walkRules(rule => {
      const indentation = getIndent(rule)
      rule.raws.before = getRuleBefore(rule, indentation)
      rule.raws.between = ' '
      rule.raws.after = '\n' + indentation
      rule.raws.semicolon = true

      let tmp = []
      const separator = ',\n' + indentation
      rule.selectors.forEach(selector => {
        if (!hasPlusInsideParens(selector) && !isAttrSelector(selector)) {
          selector = selector.replace(/\s*([+~>])\s*/g, " $1 ").trim()
        }
        if (isAttrSelector(selector)) {
          selector = selector.replace(/\[\s*(\S+)\s*\]/g, "[$1]")
        }
        tmp.push(selector)
      })
      rule.selector = tmp.join(separator)
    })

    root.walkDecls(decl => {
      const indentation = getIndent(decl)
      decl.raws.between = ': '
      if (decl.raws.value) {
        decl.raws.value.raw = decl.raws.value.raw.trim()
      }

      let declBefore = '\n' + indentation
      const prev = decl.prev()
      if (prev || decl.parent.type !== 'root') {
        const nlCount = decl.raws.before.split('\n').length - 1
        if (nlCount) {
          declBefore = '\n'.repeat(nlCount) + indentation
        }
      }
      if (decl == root.first) {
        declBefore = ''
      }
      decl.raws.before = declBefore
    })

    root.walkAtRules(atrule => {
      const indentation = getIndent(atrule)
      let before = getRuleBefore(atrule, indentation)
      atrule.raws.after = '\n' + indentation
      atrule.raws.between = atrule.nodes ? ' ' : ''
      atrule.raws.afterName = atrule.params ? ' ' : ''

      if (atrule.name === 'else') {
        before = atrule.raws.before
      }
      atrule.raws.before = before
    })
  }
})
