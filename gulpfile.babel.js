import 'babel-polyfill';
import path from 'path';
import gulp from 'gulp';
import load from 'gulp-load-plugins';
import {sync as globSync} from 'globby';
import Babel from './tasks/babel';

const babel = new Babel();

try {
  const bootstrap = require('./packages/gulpy-boiler-core/src');
  const webpack = {
    entry: {
      js: 'index.js',
      assets: 'assets.js'
    },
    alias: {
      underscore: 'lodash',
      'js-cookie': 'jquery.cookie'
    },
    define: {
      BLEEP: JSON.stringify('bloop')
    },
    expose: {
      'Cookie': 'js-cookie'
    },
    externals: {
      jquery: 'jQuery'
    },
    provide: {
      'global.jQuery': 'jquery',
      'window.jQuery': 'jquery',
      '$': 'jquery'
    }
  };
  const opts = {
    plugins: {
      packages: ['./package.json', './packages/*/package.json']
      //rename,
      //lazy,
      //patterns
    },
    config: {
      sources: {
        templating: {
          dir: 'templates',
          layouts: 'layouts',
          pages: 'pages'
        },
        bundler: {
          jsBundle: 'main',
          cssBundle: 'main'
        }
      },
      tasks: {
        webpack
      }
      //env,
      //sources,
      //tasks,
      //utils
    },
    dirs: {
      tasks: [
        path.resolve('./tasks'),
        path.resolve('./packages/gulpy-boiler-task-eslint')
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
  gulp.task('webpack:js', tasks.webpack);
  gulp.task('webpack:css', tasks.webpack);
  gulp.task('webpack', gulp.parallel('webpack:js', 'webpack:css'));
  gulp.task('babel', babel.task(gulp, plugins, config));
  gulp.task('assemble', tasks.assemble);

  const baseTasks = gulp.series('lint', 'babel');

  gulp.task('watch:build', () => {
    gulp.watch([
      addbase('tasks/**/*.js'),
      addbase('packages/*/src/**/*.js'),
      addbase('gulpfile.babel.js')
    ]).on('change', baseTasks);
  });

  gulp.task('build', gulp.series(baseTasks, 'webpack', 'assemble'));
  gulp.task('watch', gulp.series('build', 'watch:build'));
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

  gulp.task('babel', babel.task(gulp, plugins, config));
}
