import merge from 'merge-deep';

/**
 * Make the config
 * @param {Object} sources mixin
 * @return {Object}
 */
export default function({sources}) {
  const protocol = sources.protocol || 'http';
  const devPath = sources.devPath || 'localhost';

  return merge({
    srcDir: 'src',
    buildDir: 'dist',
    devPort: 8000,
    devPath: [protocol, '://', devPath].join(''),
    protocol
  }, sources);
}
