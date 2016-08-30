import makeEnv from './environment';
import makeConfig from './config';
import makeUtils from './utils';

/**
 * Construct a `config` Object to get passed around to all Gulp tasks
 * @param {Object} opts options
 * @param {Object} opts.env mixin for enivironment
 * @param {Object} opts.sources mixin for config
 * @param {Object} opts.utils mixin for utils
 * @return {Object} config Object with `sources`, `environment`, and `utils` keys
 */
export default function(opts = {}) {
  const {
    environment = {},
    sources = {},
    utils = {}
  } = opts;

  return {
    environment: makeEnv({environment}),
    sources: makeConfig({sources}),
    utils: makeUtils({utils})
  };
}
