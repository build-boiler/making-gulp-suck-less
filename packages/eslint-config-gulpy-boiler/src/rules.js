export default {
  'one-var-declaration-per-line': ['error', 'initializations'],
  'one-var': [2, {
    uninitialized: 'always',
    initialized: 'never'
  }],
  'max-len': ['error', {
    code: 120,
    ignoreUrls: true
  }],
  semi: ['warn', 'always'],
  'default-case': 0,
  'func-names': 0,
  'no-case-declarations': 0,
  'prefer-template': 0,
  'no-param-reassign': 0,
  'consistent-return': 0,
  'import/prefer-default-export': 0,
  'import/newline-after-import': 0,
  'no-unused-vars': ['error', { vars: 'all', args: 'none' }],
  'no-confusing-arrow': 0,
  'space-before-function-paren': ['error', 'never'],
  'no-underscore-dangle': 0,
  'no-shadow': 0,
  'no-mixed-operators': ['error', {
    groups: [
      ['&', '|', '^', '~', '<<', '>>', '>>>']
    ]
  }],
  'import/no-extraneous-dependencies': 0,
  'babel/arrow-parens': 0,
  'arrow-body-style': 0,
  'comma-dangle': 0,
  'global-require': 0,
  'object-curly-spacing': 0
}
