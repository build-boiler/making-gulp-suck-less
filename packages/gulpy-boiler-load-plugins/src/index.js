import path from 'path';
import load from 'gulp-load-plugins';

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
  const {pattern, lazy, rename, config} = opts;
  const defaultPkg = path.join(process.cwd(), 'package.json');
  const loadOpts = {
    config: config || defaultPkg,
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

  return Object.assign({}, load(loadOpts));
}
