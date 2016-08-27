import merge from 'merge-deep';

/**
 * Make the config
 * @param {String} env enviroment i.e  "development" or "production"
 * @param {Object} sources mixin
 * @return {Object}
 */
export default function({env, sources}) {
  const protocol = sources.protocol || 'http';
  const devPath = sources.devPath || 'localhost';

  return merge({
    srcDir: 'src',
    buildDir: 'dist',
    devPort: 8000,
    hotPort: 8080,
    devPath: [protocol, '://', devPath].join(''),
    protocol
  }, sources);
}
