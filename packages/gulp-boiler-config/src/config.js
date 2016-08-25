import merge from 'merge-deep';

/**
 * Make the config
 * @param {String} env enviroment i.e  "development" or "production"
 * @param {Object} sources mixin
 * @return {Object}
 */
export default function({env, sources}) {
  return merge({
    srcDir: 'src',
    buildDir: 'dist'
  }, sources);
}
