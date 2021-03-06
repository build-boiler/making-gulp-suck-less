import path from 'path'
import {TaskHandler} from 'gulpy-boiler-utils'
import formatter from 'eslint-friendly-formatter'

/**
 * Typical `gulp-boiler` task function
 * @param {Object} gulp Gulp instance
 * @param {Object} plugins plugins gathered from `gulp-load-plugins`
 * @param {Object} config configuration utilities
 * @return {Function} to be registered with gulp task
 */
export default class Eslint extends TaskHandler {
  constructor(name, plugins, config) {
    super(name, plugins, config)

    const {environment, utils} = config
    const {isLocalDev} = environment
    const {addbase, getTarget} = utils
    const target = getTarget({name})
    const rootDir = path.resolve(__dirname, '..', '..', '*')
    let src, base

    if (target === 'test') {
      base = path.join(rootDir, 'test/**/*.js')
      src = [addbase('test', '**/*.js')]
    } else if (target === 'build') {
      base = path.join(rootDir, 'src/**/*.js')
      src = [
        addbase('tasks', '**/*.js'),
        addbase('gulpfile.babel.js')
      ]
    }

    /**
     * Lint internal files if developing locally with Lerna
     */
    if (isLocalDev) {
      src.push(base)
    }

    const sources = {src, base, target}

    this.configure({sources})
    this.loadPlugins({
      config: path.resolve(__dirname, '..', 'package.json')
    })
  }
  task(gulp, plugins, config) {
    const {environment, sources} = config
    const {src, target} = sources
    const {eslint, gulpIf} = plugins
    const {isDev, isLocalDev} = environment
    const basePath = isLocalDev ?
      path.resolve(__dirname, '..', '..', 'eslint-config-gulpy-boiler', 'dist', 'index.js') :
      require.resolve('eslint-config-gulpy-boiler')
    const getConfig = (fp) => {
      return fp ? path.join(path.dirname(basePath), fp) : basePath
    }

    return () => {
      let configFile

      switch (target) {
        case 'test':
          configFile = getConfig('ava.js')
          break
        case 'build':
          configFile = getConfig('build.js')
          break
        default:
          configFile = getConfig()
          break
      }

      const eslintConfig = {configFile}

      this.emit('change', eslintConfig)

      return gulp.src(src)
        .pipe(eslint(eslintConfig))
        .pipe(eslint.format(formatter))
        .pipe(gulpIf(!isDev, eslint.failAfterError()))
    }
  }
}
