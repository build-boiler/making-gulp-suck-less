import 'babel-polyfill';
import gulp from 'gulp';
import babel from './tasks/babel';

const {TRAVIS_BRANCH} = process.env;
const isCi = !!TRAVIS_BRANCH;
const opts = {
  plugins: {
    //config,
    //rename,
    //lazy,
    //patterns
  },
  config: {
    environment: {
      isCi
    }
    //sources,
    //tasks,
    //utils
  },
  dirs: {
    tasks: [
      'tasks',
      'packages/gulpy-boiler-task-ava',
      'packages/gulpy-boiler-task-eslint'
    ]
  },
  wrapper: {
    //args
  }
};

try {
  const bootstrap = require('./packages/gulpy-boiler-core/src');
  const {tasks, plugins, config} = bootstrap(gulp, opts);
  const {utils} = config;
  const {addbase} = utils;

  gulp.task('ava', tasks.ava);
  gulp.task('lint:test', tasks.eslint);
  gulp.task('lint:build', tasks.eslint);
  gulp.task('lint', gulp.parallel('lint:test', 'lint:build'));
  gulp.task('webpack:js', tasks.webpack);
  gulp.task('webpack:css', tasks.webpack);
  gulp.task('webpack', gulp.parallel('webpack:js', 'webpack:css'));
  gulp.task('babel', babel(gulp, plugins, config));
  gulp.task('assemble', tasks.assemble);

  gulp.task('watch:build', () => {
    gulp.watch([
      addbase('tasks/**/*.js'),
      addbase('packages/*/src/**/*.js'),
      addbase('gulpfile.babel.js')
    ]).on('change', gulp.series('lint:build', 'babel'));

    gulp.watch([
      addbase('packages/*/test/**/*.js')
    ]).on('change', gulp.series('lint:test'));
  });

  gulp.task('build', gulp.series('lint', 'babel', 'webpack', 'assemble'));
  gulp.task('watch', gulp.series('build', 'watch:build'));
  gulp.task('default', gulp.series('babel'));
} catch (err) {
  if (!isCi) {
    console.error('**FALLING BACK TO DEFAULT BUILD**', err.message, err.stack);
  }

  require('./fallback');
}
