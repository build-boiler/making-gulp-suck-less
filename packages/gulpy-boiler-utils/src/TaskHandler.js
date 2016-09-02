// @flow
import EventEmitter from 'events'
import load from 'gulpy-boiler-load-plugins'
import merge from 'merge-deep'
import cli from './cli'

import type {
  Gulp,
  ConfigObject,
  PluginObject
} from '../../../build/types'

export default class TaskHandler extends EventEmitter {
  name: string;
  plugins: PluginObject;
  config: ConfigObject;

  constructor(
    name: string,
    plugins: PluginObject = {},
    config: ConfigObject = {}
  ) {
    super()
    this.name = name
    this.plugins = plugins
    this.config = config
  }

  // In a better world, we'd know what options can be passed in, and I'd know
  // what exactly is inside the array being returned
  cli(opts: Object = {}) : Array<any> {
    const data = cli(opts)
    const {flags} = data
    const cliData = Object.keys(flags).reduce((acc, key) => {
      const aliasVal = opts.alias && opts.alias[key]

      if (aliasVal) {
        Object.assign(acc.flags, {
          [aliasVal]: flags[key]
        })
      }

      return acc
    }, data)

    this.configure({
      cli: cliData
    })

    return cliData
  }

  /**
   * Merge config/plugins from base tasks with
   *  - config/plugins external task
   *  - onto context of TaskHandler parent instance
   */
  configure(config: ConfigObject = {}): ConfigObject {
    this.config = merge({}, this.config, config)

    return this.config
  }

  loadPlugins(opts: PluginObject = {}): PluginObject {
    Object.assign(this.plugins, load(opts))

    return this.plugins
  }

  run(gulp: Gulp, ...args: Array<any>): void {
    return this.task(gulp, this.plugins, this.config, ...args)
  }

  task(
    gulp: Gulp,
    plugins: PluginObject,
    config: ConfigObject,
  ): void {
  }
}
