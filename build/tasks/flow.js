import reporter from 'flow-reporter'
import {TaskHandler} from '../../packages/gulpy-boiler-utils'

export default class Flow extends TaskHandler {
  task(gulp, plugins, config) {
    const {environment, utils} = config
    const {addbase} = utils
    const {isCi} = environment
    const {flowtype} = plugins
    const src = [
      addbase('build', '**/*.js'),
      addbase('packages', '*', 'src/**/*.js')
    ]
    const options = {
      all: false,
      weak: false,
      declarations: './declarations/',
      killFlow: isCi,
      beep: !isCi,
      abort: false,
      reporter
    }

    return () => {
      return gulp.src(src)
        .pipe(flowtype(options))
    }
  }
}
