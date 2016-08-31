import 'babel-polyfill';
import gulp from 'gulp';
import opts from './build/config';

const {TRAVIS_BRANCH} = process.env;

try {
  /**
   * Dynamic `require` because before `babel` runs the `packages` main files
   * will not be compiled and therefore will not exist. In this case we fallback
   * to just compile directly with the `build/tasks/babel.js`
   */
  const build = require('./packages/gulpy-boiler-core');

  const {tasks, plugins, config} = build(gulp, opts);
  const {browserSync} = plugins;
  const {environment, sources, utils} = config;
  const {srcDir} = sources;
  const {isDev} = environment;
  const {addbase} = utils;

  gulp.task('ava', tasks.ava);
  gulp.task('babel', tasks.babel);
  gulp.task('browser-sync', tasks.browserSync);
  gulp.task('clean', tasks.clean);
  gulp.task('lint:test', tasks.eslint);
  gulp.task('lint:build', tasks.eslint);
  gulp.task('lint', gulp.parallel('lint:test', 'lint:build'));
  gulp.task('webpack:js', tasks.webpack);
  gulp.task('webpack:css', tasks.webpack);
  gulp.task('webpack', gulp.parallel('webpack:js', 'webpack:css'));
  gulp.task('assemble', tasks.assemble);

  gulp.task('watch:build', () => {
    gulp.watch([
      addbase('build/**/*.js'),
      addbase('packages/*/src/**/*.js'),
      addbase('gulpfile.babel.js')
    ]).on('change', gulp.series('lint:build', 'babel'));

    gulp.watch([
      addbase('packages/*/test/**/*.js')
    ]).on('change', gulp.series('lint:test'));

    gulp.watch([
      addbase(srcDir, 'templates/**/*.html')
    ]).on('change', browserSync.reload);
  });

  gulp.task('dev', gulp.series('babel', 'lint', 'watch:build'));

  gulp.task('build', (cb) => {
    let task;

    if (isDev) {
      task = gulp.series('clean', 'babel', 'lint', 'webpack', 'assemble', 'browser-sync');
    } else {
      task = gulp.series('clean', 'babel', 'lint', 'webpack', 'assemble');
    }

    return task(cb);
  });

  gulp.task('watch', gulp.series('build', 'watch:build'));
  gulp.task('default', gulp.series('babel'));
} catch (err) {
  if (!TRAVIS_BRANCH) {
    console.error('**FALLING BACK TO DEFAULT BUILD**', err.message, err.stack);
  }

  require('./build/fallback');
}
