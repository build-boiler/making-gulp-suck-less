import rules from './rules';

export default {
  extends: [
    'eslint-config-babel',
    './airbnd-override.js'
  ].map(require.resolve),
  rules
};
