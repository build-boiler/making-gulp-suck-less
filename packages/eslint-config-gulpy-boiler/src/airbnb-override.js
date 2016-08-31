import omit from 'lodash/omit'
import merge from 'lodash/merge'
import airbnb from 'eslint-config-airbnb'

const config = airbnb.extends.reduce((acc, fp) => {
  return merge(acc, require(fp))
}, {})
const {rules: allRules} = config
const rules = omit(allRules, 'react/require-extension')

export default Object.assign({}, config, {rules})
