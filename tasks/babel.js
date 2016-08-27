import path from 'path';
import through from 'through2';
import EventEmitter from 'events';

export default class Babel extends EventEmitter {
  task(gulp, plugins, config) {
    const {
      babel,
      plumber,
      newer,
      gutil,
      gulpIf
    } = plugins;
    const {log, colors} = gutil;
    const {cyan} = colors;
    const {environment} = config;
    const {isDev} = environment;
    const scripts = './packages/*/src/**/*.js';
    const dest = 'packages';
    let srcEx, libFragment;

    if (path.win32 === path) {
      srcEx = /(packages\\[^\\]+)\\src\\/;
      libFragment = '$1\\dist\\';
    } else {
      srcEx = new RegExp('(packages/[^/]+)/src/');
      libFragment = '$1/dist/';
    }

    return () => {
      return gulp.src(scripts)
      .pipe(plumber({
        errorHandler: function(err) {
          log(err.stack);
        }
      }))
      .pipe(through.obj(function(file, enc, cb) {
        file._path = file.path;
        file.path = file.path.replace(srcEx, libFragment);
        cb(null, file);
      }))
      .pipe(gulpIf(isDev, newer(dest)))
      .pipe(through.obj(function(file, enc, cb) {
        log(`Compiling", '${cyan(file._path)}'`);
        cb(null, file);
      }))
      .pipe(babel())
      .pipe(gulp.dest(dest));
    };
  }
}
