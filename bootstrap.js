import addTarget from './packages/gulp-boiler-add-task-target';
import getTasks from './packages/gulp-boiler-require-dir';
import lazyLoad from './packages/gulp-boiler-lazy-task';
import makeConfig from './packages/gulp-boiler-config';
import loadPlugins from './packages/gulp-boiler-load-plugins';

export default function(gulp) {
  addTarget(gulp);

  const plugins = loadPlugins();
  const config = makeConfig();
  const tasksObj = getTasks();
  const tasks = lazyLoad(tasksObj, gulp, plugins, config);

  return {
    config,
    plugins,
    tasks
  };
}
