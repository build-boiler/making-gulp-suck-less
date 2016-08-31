import path from 'path'
import {TaskHandler} from 'gulpy-boiler-utils'
import avaPlugin from './plugin'

/**
 * Typical `gulp-boiler` task function
 * @param {Object} gulp Gulp instance
 * @param {Object} plugins plugins gathered from `gulp-load-plugins`
 * @param {Object} config configuration utilities
 * @return {Function} to be registered with gulp task
 */
export default class Ava extends TaskHandler {
  constructor(name, plugins, config) {
    super(name, plugins, config)

    const {environment} = config
    const {isLocalDev, isCi} = environment
    const {flags} = this.cli({
      cmd: 'gulp ava',
      options: [
        '-c, --coverage test coverage with nyc',
        '-f, --file specify a single file',
        '-d, --debug run with iron-node',
        '-vb, --verbose run in verbose mode',
        '-w, --watch test files'
      ],
      alias: {
        c: 'coverage',
        d: 'debug',
        f: 'file',
        vb: 'verbose',
        w: 'watch'
      },
      examples: '--file bleep-spec'
    })
    const {coverage, debug, watch} = flags
    const ava = {
      nyc: coverage,
      debug,
      serial: debug,
      require: path.resolve(__dirname, '.', 'babel-hook.js'),
      verbose: flags.verbose || !isCi,
      watch
    }

    this.configure({
      ava,
      sources: {
        srcDir: isLocalDev ? 'packages/*/test' : 'test/unit'
      }
    })
    this.loadPlugins({
      config: path.resolve(__dirname, '..', 'package.json')
    })
  }
  task(gulp, plugins, config) {
    const {sources, utils, cli, ava} = config
    const {srcDir} = sources
    const {addbase} = utils
    const {file} = cli.flags
    const src = file ? addbase(srcDir, `${file}.js`) : addbase(srcDir, '**/*-spec.js')

    return () => {
      return gulp.src(src)
        .pipe(avaPlugin(ava))
    }
  }
}
