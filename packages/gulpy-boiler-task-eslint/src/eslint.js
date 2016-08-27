import path from 'path';
import EventEmitter from 'events';
import makeEslintConfig from 'boiler-config-eslint';
import formatter from 'eslint-friendly-formatter';

/**
 * Typical `gulp-boiler` task function
 * @param {Object} gulp Gulp instance
 * @param {Object} plugins plugins gathered from `gulp-load-plugins`
 * @param {Object} config configuration utilities
 * @return {Function} to be registered with gulp task
 */
export default class Eslint extends EventEmitter {
  task(gulp, plugins, config) {
    const {environment, utils, metaData} = config;
    const {eslint} = plugins;
    const {isDev, isLocalDev} = environment;
    const {addbase, getTarget} = utils;
    let src, base;

    return () => {
      const target = getTarget(metaData);
      const rootDir = path.resolve(__dirname, '..', '..', '*');

      if (target === 'test') {
        base = path.join(rootDir, 'test/**/*.js');
        src = [addbase('test', '**/*.js')];
      } else if (target === 'build') {
        base = path.join(rootDir, 'src/**/*.js');
        src = [
          addbase('tasks', '**/*.js'),
          addbase('gulpfile.babel.js')
        ];
      }

      /**
       * Lint internal files if developing locally with Lerna
       */
      if (isLocalDev) {
        src.push(base);
      }

      const eslintConfig = makeEslintConfig({
        basic: false,
        react: false,
        generate: false,
        isDev,
        lintEnv: target
      });

      return gulp.src(src)
      .pipe(eslint(eslintConfig))
      .pipe(eslint.format(formatter));
    };
  }
}
