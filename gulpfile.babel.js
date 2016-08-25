import 'babel-polyfill';
import path from 'path';
import gulp from 'gulp';
import load from 'gulp-load-plugins';
import {sync as globSync} from 'globby';
import addTarget from './packages/gulp-boiler-add-task-target';
import babel from './tasks/babel';
import eslint from './tasks/eslint';

addTarget(gulp);

const loadOpts = {
  pattern: [
    'gulp-*',
    'gulp.*',
    'del',
    'run-sequence',
    'browser-sync'
  ],
  lazy: false,
  rename: {
    'gulp-util': 'gutil',
    'run-sequence': 'sequence',
    'gulp-if': 'gulpIf'
  }
};

const packages = ['./package.json', ...globSync('./packages/*/package.json')];
const plugins = packages.reduce((acc, fp) => {
  const config = path.resolve(fp);
  const opts = Object.assign({}, loadOpts, {config});
  const plugins = load(opts);

  return {
    ...acc,
    ...plugins
  };
}, {});

const isDev = process.argv.includes('watch');
const environment = {
  isLocalDev: true,
  isDev
};

const utils = {
  addbase(...args) {
    return path.join.apply(path, [process.cwd(), ...args]);
  },
  addroot(...args) {
    return this.addbase.apply(this, ['packages', ...args]);
  },
  getTaskName({name}) {
    return name.split(':').slice(-1)[0];
  }
};

const sources = {
  buildDir: 'dist'
};

const config = {environment, sources, utils};
const lint = function(cb) {
  const metaData = this;
  const fn = eslint(gulp, plugins, Object.assign({}, config, metaData));

  return fn(cb);
};

gulp.task('lint:test', lint);
gulp.task('lint:build', lint);
gulp.task('lint', gulp.parallel('lint:test', 'lint:build'));
gulp.task('babel', babel(gulp, plugins, config));

const tasks = gulp.series('lint', 'babel');

gulp.task('watch:build', () => {
  gulp.watch([
    utils.addbase('packages/*/src/**/*.js'),
    utils.addbase('gulpfile.babel.js')
  ]).on('change', tasks);
});

gulp.task('build', tasks);
gulp.task('watch', gulp.series(tasks, 'watch:build'));
gulp.task('default', gulp.series('babel'));
