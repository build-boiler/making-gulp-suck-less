// @flow
import reporter from 'flow-reporter'
import {TaskHandler} from '../../packages/gulpy-boiler-utils'

import type {
  Gulp,
  ConfigObject,
  PluginObject
} from '../types'

export default class Flow extends TaskHandler {
  task(
    gulp: Gulp,
    plugins: PluginObject,
    config: ConfigObject,
  ) {
    // If TaskHandler defaulted to having these keys present instead of empty,
    // we could move faster instead of checking for presence.
    let addbase, src

    const {utils} = config
    const {flowtype} = plugins

    if (utils) {
      addbase = utils.addbase
    }

    if (addbase) {
      src = [
        addbase('build', '**/*.js'),
        addbase('packages', '*', 'src/**/*.js')
      ]
    }

    const options = {
      all: false,
      weak: false,
      declarations: './declarations/',
      killFlow: false,
      beep: true,
      abort: false,
      reporter
    }

    return () => {
      return gulp.src(src)
        .pipe(flowtype(options))
    }
  }
}
