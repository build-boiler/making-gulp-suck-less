import 'babel-polyfill';
import path from 'path';
import gulp from 'gulp';
import load from 'gulp-load-plugins';
import {sync as globSync} from 'globby';
import babel from './tasks/babel';
import bootstrap from './packages/gulp-boiler-core';

try {
  const opts = {
    plugins: {
      packages: ['./package.json', './packages/*/package.json']
      //rename,
      //lazy,
      //patterns
    },
    config: {
      //env,
      //sources,
      //tasks,
      //utils
    },
    dirs: {
      tasks: [
        path.resolve('./tasks'),
        path.resolve('./packages/gulp-boiler-task-eslint')
      ]
      //lazy,
      //tasks,
    },
    wrapper: {
      //args
    }
  };
  const {tasks, plugins, config} = bootstrap(gulp, opts);
  const {utils} = config;
  const {addbase} = utils;

  gulp.task('lint:test', tasks.eslint);
  gulp.task('lint:build', tasks.eslint);
  gulp.task('lint', gulp.parallel('lint:test', 'lint:build'));
  gulp.task('babel', babel(gulp, plugins, config));

  const baseTasks = gulp.series('lint', 'babel');

  gulp.task('watch:build', () => {
    gulp.watch([
      addbase('packages/*/src/**/*.js'),
      addbase('gulpfile.babel.js')
    ]).on('change', baseTasks);
  });

  gulp.task('build', baseTasks);
  gulp.task('watch', gulp.series(baseTasks, 'watch:build'));
  gulp.task('default', gulp.series('babel'));

  const say = async (prom) => {
    const message = await prom;

    console.log(message);
  };

  gulp.task('async', () => {
    return say(
      Promise.resolve('**hello**')
    );
  });
} catch (err) {
  console.log('**FALLING BACK TO DEFAULT BUILD', err.message, err.stack);

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

  gulp.task('babel', babel(gulp, plugins, config));
}
