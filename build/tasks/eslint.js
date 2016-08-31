import Eslint from '../../packages/gulpy-boiler-task-eslint'

export default class EslintChild extends Eslint {
  constructor(name, plugins, config) {
    super(name, plugins, config)

    const {addbase, getTarget} = config.utils
    const target = getTarget({name})

    if (target === 'build') {
      const {sources} = this.config
      const src = [
        addbase('build', '**/*.js'),
        ...sources.src
      ]

      this.configure({
        sources: {src}
      })
    }
  }
}

