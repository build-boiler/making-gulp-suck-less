/**
 * Wrap the `require`ed Gulp task in an extra function to lazy-load the task
 * and potentially retrieve metaData with target data.
 * @param {Object} tasks key => camelCase task name, val => task Function
 * @param {Array} args extra arguments, generally `gulp`, `plugins`, `config`
 * @return {Object} tasks Object with lazy-loaded tasks
 */
export default function(tasks = {}, ...args) {
  return Object.keys(tasks).reduce((acc, taskName) => {
    const task = tasks[taskName];

    acc[taskName] = function(cb) {
      /**
       * In Gulp3 the `metaData` is put on the Gulp instance and in Gulp4
       * it is bound as the context of the task funtion
       */
      const metaData = args[0].metaData || this.metaData;
      const gulpFn = task.apply(this, [...args, metaData]);

      return gulpFn(cb);
    };

    return acc;
  }, {});
}
