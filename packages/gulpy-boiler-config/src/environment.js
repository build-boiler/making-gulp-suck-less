import path from 'path';

/**
 * Make the environment
 * @param {String} environment enviromental config
 * @return {Object}
 */
export default function({environment}) {
  const {NODE_ENV} = process.env;
  const defaultEnv = process.argv.includes('watch') ? 'development' : 'production';
  const env = environment.env || NODE_ENV || defaultEnv;
  const isDev = env === 'development';
  const rootDir = path.resolve(__dirname, '..', '..');
  const isLocalDev = path.basename(rootDir) === 'packages';
  const assetPath = isDev ? '/' : '/'; // enter CDN paths here that vary with environment

  return Object.assign({}, environment, {
    assetPath,
    env,
    isDev,
    isLocalDev
  });
}
