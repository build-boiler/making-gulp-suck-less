import path from 'path'
import nunjucks from 'nunjucks'

export default class GetAsset {
  constructor() {
    this.tags = ['get_asset']
  }

  parse(parser, nodes, lexer) {
    const tok = parser.nextToken()
    const args = parser.parseSignature(null, true)

    if (args.children.length === 0) {
      args.addChild(new nodes.Literal(0, 0, ''))
    }

    parser.advanceAfterBlockEnd(tok.value)
    return new nodes.CallExtension(this, 'run', args)
  }

  addLink(fp, sha) {
    const attrs = {
      rel: 'stylesheet',
      href: fp,
      sha
    }

    return `<link ${this.makeAttrs(attrs)}>\n`
  }

  addScript(fp, sha) {
    const attrs = {
      type: 'text/javascript',
      src: fp,
      sha
    }

    return `<script ${this.makeAttrs(attrs)}></script>`
  }

  makeAttrs(attrs) {
    const joinAttr = (key, val) => `${key}="${val}"`

    return Object.keys(attrs).reduce((list, attrName) => {
      const attrVal = attrs[attrName]

      if (attrName === 'sha' && attrVal) {
        list.push(...[
          joinAttr('integrity', attrVal),
          joinAttr('crossorigin', 'anonymous')
        ])
      } else {
        list.push(
          joinAttr(attrName, attrVal)
        )
      }

      return list
    }, []).join(' ')
  }

  basePath(fp) {
    return path.join(
      path.basename(path.dirname(fp)),
      path.basename(fp)
    )
  }

  run(context, args) {
    const {ctx} = context
    const {
      assets = {}
    } = ctx
    const {
      integrity: integrityStats,
      javascript = {},
      styles = {}
    } = assets
    const {type, integrity} = args
    let fp, sha, tag

    switch (type) {
      case 'css':
        fp = styles.main
        sha = integrity && integrityStats[this.basePath(fp)]
        tag = this.addLink(fp, sha)
        break
      case 'js':
        fp = javascript.main
        sha = integrity && integrityStats[this.basePath(fp)]
        tag = this.addScript(fp, sha)
        break
    }

    return new nunjucks.runtime.SafeString(tag || '')
  }
}
