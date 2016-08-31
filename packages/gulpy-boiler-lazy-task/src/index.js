import kind from 'kind-of';

/**
 * Wrap the `require`ed Gulp task in an extra function to lazy-load the task
 * and potentially retrieve metaData with target data.
 * @param {Object} tasks key => camelCase task name, val => task Function
 * @param {Object} gulp Gulp instance
 * @param {Object} plugins plugins gathered from `gulp-load-plugins`
 * @param {Object} config configuration utilities
 * @param {Object} opts options containing extra arguments to task wrapper function
 * @return {Object} tasks Object with lazy-loaded tasks
 */
export default function(tasks = {}, gulp, plugins, config, opts = {}) {
  const isConsumableFn = (fn) => !/class/.test(fn.toString()) && fn.length >= 3;
  let {args = []} = opts;

  return Object.keys(tasks).reduce((acc, taskName) => {
    const taskGetter = tasks[taskName];
    const taskType = kind(taskGetter);

    if (taskType !== 'function') {
      throw new Error(`Supplied task must be a function received type ${taskType} from ${taskName}`); // eslint-disable-line max-len
    }

    // lazy load the `require`
    const taskFn = taskGetter();

    args = Array.isArray(args) ? args : [args];

    acc[taskName] = function(cb) {
      /**
       * In Gulp3 the `metaData` is put on the Gulp instance and in Gulp4
       * it is bound as the context of the task funtion
       */
      const metaData = gulp.metaData || this.metaData;
      const {name: target} = metaData;
      let gulpFn;

      Object.assign(config, {metaData});

      if (isConsumableFn(taskFn)) {
        gulpFn = taskFn(gulp, plugins, config, ...args);
      } else {
        /* eslint new-cap:0 */
        const taskInst = new taskFn(target, plugins, config);

        gulpFn = taskInst.run(gulp, ...args);
      }

      return gulpFn(cb);
    };

    return acc;
  }, {});
}
