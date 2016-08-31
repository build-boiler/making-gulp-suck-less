export default {
  extends: [
    './index.js'
  ].map(require.resolve),
  plugins: ['ava'],
  rules: {
    'no-console': 0
  }
};
