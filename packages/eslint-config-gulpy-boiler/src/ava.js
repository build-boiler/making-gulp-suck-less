export default {
  extends: [
    './index.js'
  ].map(require.resolve),
  plugins: ['ava'],
  rules: {
    semi: ['warn', 'never'],
    'no-console': 0
  }
}
