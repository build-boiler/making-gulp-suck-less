import addTarget from 'gulpy-boiler-add-task-target';
import loadPlugins from 'gulpy-boiler-load-plugins';
import makeConfig from 'gulpy-boiler-config';
import getTasks from 'gulpy-boiler-require-dir';
import lazyLoad from 'gulpy-boiler-lazy-task';

/**
 * Bootstrap the `gulp-boiler` system
 * @param {Object} gulp Gulp instance
 * @param {Object} opts options
 * @param {Object} opts.plugins options for `gulp-boiler-load-plugins`
 * @param {Object} opts.config options for `gulp-boiler-config`
 * @param {Object} opts.dirs options for `gulp-boiler-require-dir`
 * @param {Object} opts.wrapper options for `gulp-boiler-lazy-task`
 * @return {Object} config, plugins, tasks
 */
export default function(gulp, opts) {
  addTarget(gulp); //access the gulp task name inside the task

  const plugins = loadPlugins(opts.plugins); //opts.pattern, opts.lazy, opts.rename, opts.packages} = opts
  const config = makeConfig(opts.config); //opts.tasks, opts.sources, opts.env, opts.utils
  const tasksObj = getTasks(opts.dirs); //opts.tasks, opts.lazy => default true
  const tasks = lazyLoad(tasksObj, gulp, plugins, config, opts);

  return {
    tasks,
    plugins,
    config
  };
}
