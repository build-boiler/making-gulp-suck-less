import makeEnv from './environment';
import makeConfig from './config';
import makeUtils from './utils';

/**
 * Construct a `config` Object to get passed around to all Gulp tasks
 * @param {Object} opts options
 * @param {Object} opts.env mixin for enivironment
 * @param {Object} opts.sources mixin for config
 * @param {Object} opts.tasks options to be passed to the specific task
 * @param {Object} opts.utils mixin for utils
 * @return {Object} config Object with `sources`, `environment`, and `utils` keys
 */
export default function(opts = {}) {
  const {NODE_ENV} = process.env;
  const {sources, tasks = {}, utils} = opts;
  const defaultEnv = process.argv.includes('watch') ? 'development' : 'production';
  const env = opts.env || NODE_ENV || defaultEnv;

  return {
    environment: makeEnv({env}),
    sources: makeConfig({env, sources}),
    tasks,
    utils: makeUtils({env, utils})
  };
}
