import cors from 'cors'
import {TaskHandler} from '../../packages/gulpy-boiler-utils'

export default class BrowserSync extends TaskHandler {
  task(gulp, plugins, config) {
    const {browserSync: runner} = plugins
    const {sources, utils} = config
    const {devPort, buildDir} = sources
    const {addbase} = utils

    return (cb) => {
      const middleware = [
        cors()
      ]

      const bsConfig = {
        open: true,
        port: devPort,
        server: {
          baseDir: addbase(buildDir),
          middleware
        }
      }

      runner(bsConfig)
    }
  }
}
