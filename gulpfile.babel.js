import 'babel-polyfill';
import path from 'path';
import gulp from 'gulp';
import load from 'gulp-load-plugins';
import {sync as globSync} from 'globby';
import babel from './tasks/babel';

const {TRAVIS_BRANCH} = process.env;
const isCi = !!TRAVIS_BRANCH;

try {
  const bootstrap = require('./packages/gulpy-boiler-core/src');
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

  const baseTasks = gulp.series('lint', 'babel');

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

  gulp.task('build', gulp.series(baseTasks, 'webpack', 'assemble'));
  gulp.task('watch', gulp.series('build', 'watch:build'));
  gulp.task('default', gulp.series('babel'));
} catch (err) {
  if (!isCi) {
    console.log('**FALLING BACK TO DEFAULT BUILD', err.message, err.stack);
  }

  const loadOpts = {
    pattern: [
      '!gulpy',
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
    let plugins;

    try {
      plugins = load(opts);
    } catch (err) {
      // eslint-disable-line
    }

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

  gulp.task('babel', babel(gulp, plugins, config));
}
