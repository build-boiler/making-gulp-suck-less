export default {
  extends: [
    './index.js'
  ].map(require.resolve),
  rules: {
    'no-console': 0
  }
};
