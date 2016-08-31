import meow from 'meow'

/**
 * Use `meow` to create a cli
 * @param {Object} opts options
 * @param {String} opt.cmd command name
 * @param {Array|String} opts.options cli options
 * @param {Object} opts.alias aliases for options
 * @param {Array|String} opts.examples aliases for options
 * @return {Object} cli instance
 */
export default function(opts) {
  const {
    cmd = 'gulp',
    options = [],
    alias,
    examples
  } = opts

  const cliOpts = (Array.isArray(options) ? options : [options]).join('/n')
  const cliExamples = (Array.isArray(examples) ? examples : [examples]).map(ex => {
    return `$ ${cmd} ${ex}`
  })

  return meow(`
    Usage
    $ ${cmd} <input>

    Options
      ${cliOpts}

    Examples
      ${cliExamples}
  `, alias)
}
