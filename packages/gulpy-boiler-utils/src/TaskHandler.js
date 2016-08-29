import EventEmitter from 'events';
import load from 'gulpy-boiler-load-plugins';
import merge from 'merge-deep';
import cli from './cli';

export default class TaskHandler extends EventEmitter {
  constructor(name, plugins = {}, config = {}) {
    super();
    this.name = name;
    this.plugins = plugins;
    this.config = config;
  }

  cli(opts) {
    const data = cli(opts);
    const {flags} = data;
    const cliData = Object.keys(flags).reduce((acc, key) => {
      let aliasVal = opts.alias && opts.alias[key];

      if (aliasVal) {
        Object.assign(acc.flags, {
          [aliasVal]: flags[key]
        });
      }

      return acc;
    }, data);

    this.configure({
      cli: cliData
    });

    return cliData;
  }

  /**
   * Merge config/plugins from base tasks with
   *  - config/plugins external task
   *  - onto context of TaskHandler parent instance
   */
  configure(config = {}) {
    this.config = merge({}, this.config, config);

    return this.config;
  }

  loadPlugins(opts = {}) {
    Object.assign(this.plugins, load(opts));

    return this.plugins;
  }

  on(event, cb) {
    super.on(event, cb);

    return this;
  }

  run(gulp, ...args) {
    return this.task(gulp, this.plugins, this.config, ...args);
  }
}
