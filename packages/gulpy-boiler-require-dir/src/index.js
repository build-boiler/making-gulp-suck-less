import path from 'path';
import {readdirSync, statSync} from 'fs';

/**
 * Camel case all the dash and hyphen things
 * @param {String} name
 * @return {String}
 */
function camelCase(name) {
  return name.replace(/[-_]([a-z])/g, (sep) => sep[1].toUpperCase());
}

/**
 * Remove everything except for the filename
 * @param {String} fp
 * @return {String} filename without extension
 */
function removeExt(fp) {
  return path.basename(
    fp,
    path.extname(fp)
  );
}

/**
 * Require or cache the file
 * @param {Object} tasks accumulated tasks
 * @param {String} name the task name
 * @param {String} fp filepath
 * @return {Object} camelCase name key and file/lazy file value
 */
function requireFile(name, fp, tasks) {
  name = camelCase(name);

  if (tasks[name]) return {}; // don't overwrite parent tasks

  return {
    [camelCase(name)]: () => require(fp)
  };
}

/**
 * Creates an object with keys corresponding to the Gulp task name and
 * values corresponding to the callback function passed as the second
 * argument to `gulp.task`
 * @param {String} basePath path to directory
 * @param {Object} tasks accumulated tasks
 * @return {Object} map of task names to callback functions to be used in `gulp.task`
 */
function recurseTasks(basePath, tasks = {}) {
  let dirs;

  try {
    const pkgPath = path.join(basePath, 'package.json');

    statSync(pkgPath);

    const {main} = require(pkgPath);
    const name = removeExt(main);

    return requireFile(name, basePath, tasks);
  } catch (err) {
    dirs = readdirSync(basePath);
  }

  return dirs.reduce((acc, name) => {
    const taskPath = path.join(basePath, name);
    const taskStat = statSync(taskPath);
    let taskName, pkgStat;

    if (pkgStat && pkgStat.isFile()) {
      taskName = name;
    } else if (taskStat.isDirectory()) {
      try {
        statSync(
          path.join(taskPath, 'index.js')
        );
      } catch (err) {
        throw new Error(`task ${name} directory must have filename index.js`);
      }

      taskName = name;
    } else {
      taskName = removeExt(name);
    }

    return {
      ...acc,
      ...requireFile(taskName, taskPath, tasks)
    };
  }, {});
}

/**
 * Use `require.resolve` to determine if the task String is a module
 * @param {String} fp
 * @return {String} directory of base tasks of tasks in node modules
 */
const resolveTaskPath = (() => {
  const base = path.resolve(__dirname, '..', '..');
  const cwd = process.cwd();
  const fullPath = (basePath, fp) => {
    return path.join(
      basePath,
      fp.replace(process.cwd(), '')
    );
  };

  return function resolver(fp) {
    let taskDir;

    try {
      taskDir = path.dirname(
        require.resolve(fullPath(base, fp))
      );
    } catch (err) {
      taskDir = fullPath(cwd, fp);
    }

    return taskDir;
  };
})();

/**
 * Recursively require all files in a specified `tasks` directory
 * @param {Object} opts options
 * @param {Array|String} opts.tasks path/paths to "tasks" directory
 * @return {Object} `require`d files by camelCased keys
 */
export default function(opts = {}) {
  const base = opts.tasks || path.join(process.cwd(), 'tasks');
  let tasks;

  if (Array.isArray(base)) {
    tasks = base
      .map(resolveTaskPath)
      .sort((a, b) => a.length - b.length)
      .reduce((acc, fp) => ({
        ...acc,
        ...recurseTasks(fp, acc)
      }), {});
  } else {
    tasks = recurseTasks(base);
  }

  return tasks;
}
