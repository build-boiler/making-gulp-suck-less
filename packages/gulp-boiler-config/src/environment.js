import path from 'path';

/**
 * Make the environment
 * @param {String} env enviroment i.e  "development" or "production"
 * @return {Object}
 */
export default function({env}) {
  const isDev = env === 'development';
  const rootDir = path.resolve(__dirname, '..', '..');
  const isLocalDev = path.basename(rootDir) === 'packages';

  return {
    env,
    isDev,
    isLocalDev
  };
}
