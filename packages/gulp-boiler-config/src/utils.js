import path from 'path';
import merge from 'merge-deep';

/**
 * Make the utils
 * @param {String} env enviroment i.e  "development" or "production"
 * @param {Object} utils mixin
 * @return {Object}
 */
export default function({env, utils}) {
  const cwd = process.cwd();
  const rootDir = path.resolve(__dirname, '..', '..');

  return merge({
    addbase(...args) {
      return path.join.apply(path, [cwd, ...args]);
    },
    addroot(...args) {
      return this.addbase.apply(this, [rootDir, ...args]);
    },
    getTarget({name}) {
      return name.split(':').slice(-1)[0];
    }
  }, utils);
}
