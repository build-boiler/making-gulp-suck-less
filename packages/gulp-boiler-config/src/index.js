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
 * Creates an object with keys corresponding to the Gulp task name and
 * values corresponding to the callback function passed as the second
 * argument to `gulp.task`
 * @param {String} basePath path to directory
 * @return {Object} map of task names to callback functions to be used in `gulp.task`
 */
function recurseTasks(basePath) {
  const dirs = readdirSync(basePath);

  return dirs.reduce((acc, name) => {
    const taskPath = path.join(basePath, name);
    const taskStat = statSync(taskPath);
    let taskName;

    if (taskStat.isDirectory()) {
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
      [ camelCase(taskName) ]: require(taskPath)
    };
  }, {});
}

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
    tasks = base.reduce((acc, fp) => ({
      ...acc,
      ...recurseTasks(fp)
    }), {});
  } else {
    tasks = recurseTasks(base);
  }

  return tasks;
}
