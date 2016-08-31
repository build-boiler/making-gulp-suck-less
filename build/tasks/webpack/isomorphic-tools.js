import path from 'path'
import WebpackIsomorphicToolsPlugin from 'webpack-isomorphic-tools/plugin'

/**
 * Make da isomorphic tools
 * @param {Object} config gulp-boiler config
 * @param {String} target
 * @return {Object} webpack-ismorphic-tools plugin
 */
export default function(config, {target}) {
  const {environment, sources, utils} = config
  const {buildDir} = sources
  const {isDev} = environment
  const {addbase} = utils
  const statsFile = addbase(buildDir, `webpack-${target}-stats.json`)
  const defaultConfig = {
    debug: false,
    webpack_assets_file_path: statsFile
  }
  const toolsConfigMap = {
    js: {
      assets: {
        images: {
          extensions: [
            'jpeg',
            'jpg',
            'png',
            'gif',
            'svg'
          ],
          parser: WebpackIsomorphicToolsPlugin.url_loader_parser
        },
        styles: {
          extensions: ['css', 'scss'],
          filter(module, regex, options, log) {
            return WebpackIsomorphicToolsPlugin.style_loader_filter(module, regex, options, log)
          },
          path(module, options, log) {
            return WebpackIsomorphicToolsPlugin.style_loader_path_extractor(module, options, log)
          },
          parser(module, options, log) {
            return WebpackIsomorphicToolsPlugin.css_modules_loader_parser(module, options, log)
          }
        }
      }
    },
    css: {
      assets: {
        images: {
          extensions: [
            'jpeg',
            'jpg',
            'svg',
            'png',
            'gif'
          ],
          filter(m, regex, options, log) {
            const {name} = m
            return regex.test(name)
          },
          parser(m, options, log) {
            const {publicPath} = options.webpack_stats
            const [fullName] = m.assets
            return process.env.TRAVIS_BRANCH ? publicPath + fullName : `/${fullName}`
          },
          path(m, options, log) {
            const {name} = m
            const base = path.basename(name)
            return base
          }
        }
      }
    }
  }

  const toolsConfig = Object.assign({}, defaultConfig, toolsConfigMap[target])

  return new WebpackIsomorphicToolsPlugin(toolsConfig).development(isDev)
}
