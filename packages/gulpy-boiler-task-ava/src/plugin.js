import path from 'path';
import childProcess from 'child_process';
import {PluginError} from 'gulp-util';
import through from 'through2';
import dargs from 'dargs';

export default function(opts = {}) {
  const files = [];
  const {debug, ...options} = opts;
  let cwd = process.cwd();
  let BIN;

  try {
    BIN = require.resolve(
      debug ? path.join(cwd, 'node_modules/ava/profile.js') : path.join(cwd, 'node_modules/ava/cli.js')
    );
  } catch (err) {
    ([cwd] = cwd.split(/\/packages\//));
    BIN = require.resolve(
      debug ? path.join(cwd, 'node_modules/ava/profile.js') : path.join(cwd, 'node_modules/ava/cli.js')
    );
  }

  return through.obj(function(file, enc, cb) {
    if (file.isNull()) {
      cb(null, file);
      return;
    }

    if (file.isStream()) {
      cb(new PluginError('gulp-ava', 'Streaming not supported'));
      return;
    }

    files.push(file.path);

    cb(null, file);
  }, function(cb) {
    const args = [BIN].concat(files, '--color', dargs(options, {excludes: ['nyc']}));

    if (opts.nyc) {
      const nycBin = path.join(__dirname, 'nyc/bin/nyc.js');

      if (nycBin) {
        args.unshift(nycBin);
      } else {
        this.emit('error', new PluginError('gulp-ava', 'Couldn\'t find the `nyc` binary'));
      }
    }

    const runner = debug ? 'iron-node' : process.execPath;
    const cp = childProcess.spawn(runner, args, {cwd, stdio: 'inherit'});

    cp.on('close',  (code) =>{
      if (code) {
        return this.emit('error', new PluginError('gulp-ava', 'ava tests failed'));
      }

      cb();
    });
  });
}
