import EventEmitter from 'events';
import load from 'gulpy-boiler-load-plugins';
import merge from 'merge-deep';

export default class TaskHandler extends EventEmitter {
  constructor(name, plugins = {}, config = {}) {
    super();
    this.name = name;
    this.plugins = plugins;
    this.config = config;
  }

  /**
   * Merge config/plugins from base tasks with
   *  - config/plugins external task
   *  - onto context of TaskHandler parent instance
   */
  configure(config = {}) {
    this.config = merge({}, this.config, config);
  }

  loadPlugins(opts = {}) {
    Object.assign(this.plugins, load(opts));
  }

  on(event, cb) {
    super.on(event, cb);
  }

  run(gulp, ...args) {
    return this.task(gulp, this.plugins, this.config, ...args);
  }
}
