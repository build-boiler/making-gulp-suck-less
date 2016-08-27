import path from 'path';
import load from 'gulp-load-plugins';
import {sync as globSync} from 'globby';

/**
 * Load all the Gulp plugins for the `root` package.json and any additonal specified packages
 * @param {Object} opts options
 * @param {String|Array} opts.packages
 * @param {String|Array} opts.pattern
 * @param {Boolean} opts.lazy
 * @param {Object} opts.rename
 * @return {Object} gulp tasks plugins
 *
 */
export default function(opts = {}) {
  const {pattern, lazy, rename, packages} = opts;
  const loadOpts = {
    pattern: pattern || [
      'gulp-*',
      'gulp.*',
      'del',
      'run-sequence',
      'browser-sync'
    ],
    lazy: !!lazy,
    rename: Object.assign({
      'gulp-util': 'gutil',
      'run-sequence': 'sequence',
      'gulp-if': 'gulpIf'
    }, rename)
  };
  const defaultPkg = './package.json';
  const packageFps = globSync(packages || defaultPkg);

  if (!packageFps.includes(defaultPkg)) {
    packageFps.unshift(defaultPkg);
  }

  return packageFps.reduce((acc, fp) => {
    const config = path.resolve(fp);
    const opts = Object.assign({}, loadOpts, {config});

    try {
      const plugins = load(opts);

      Object.assign(acc, plugins);
    } catch (err) {
      console.error(`Couldn't find ${config}`);
    }

    return acc;
  }, {});
}
