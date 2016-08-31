import rules from './rules'

export default {
  extends: [
    'eslint-config-babel',
    './airbnb-override.js'
  ].map(require.resolve),
  rules
}
