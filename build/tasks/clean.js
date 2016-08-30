import del from 'del';
import {TaskHandler} from '../../packages/gulpy-boiler-utils';

export default class Clean extends TaskHandler {
  task(gulp, plugins, config) {
    const {sources, utils} = config;
    const {buildDir} = sources;
    const {addbase} = utils;

    return () => {
      return del([
        addbase(buildDir)
      ]);
    };
  }
}
