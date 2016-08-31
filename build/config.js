const {TRAVIS_BRANCH} = process.env
const isCi = !!TRAVIS_BRANCH
const opts = {
  plugins: {
    // config,
    // rename,
    // lazy,
    // patterns
  },
  config: {
    environment: {
      isCi
    }
    // sources,
    // tasks,
    // utils
  },
  dirs: {
    tasks: [
      'build/tasks',
      'packages/gulpy-boiler-task-ava'
    ]
  },
  wrapper: {
    // args
  }
}

export default opts
