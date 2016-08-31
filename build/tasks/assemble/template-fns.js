import path from 'path';
import kind from 'kind-of';

/**
 * Function to be added to the `assemble` template context
 * @param {Object} config `gulp-boiler-config`
 * @return {Object} functions to be added to template context
 */
export default function(config) {
  const {sources, utils} = config;
  const {srcDir, templateDir} = sources;
  const {addbase} = utils;

  function makeTemplatePath(dir) {
    return (fp) => `${addbase(srcDir, templateDir, dir, fp)}.html`;
  }

  function join(...args) {
    // allow Number in filepath, must convert to String or `path.join` yells
    const normalizedArgs = args.map(arg => kind(arg) === 'number' ? `${arg}` : arg);

    return path.join(...normalizedArgs);
  }

  return {
    join,
    layouts: makeTemplatePath('layouts'),
    macros: makeTemplatePath('macros'),
    partials: makeTemplatePath('partials')
  };
}
