import path from 'path';
import assemble from 'assemble-core';
import merge from 'merge-deep';
import glob from 'globby';
import {readJson} from 'fs-extra';
import {map as asyncMap} from 'async';
import renameKey from './rename-key';
import templateNunjucks from './nunjucks';
import frontMatterMiddleware from './front-matter';
import {TaskHandler} from '../../packages/gulpy-boiler-utils';

export default class Webpack extends TaskHandler {
  task(gulp, plugins, config) {
    const app = assemble();
    const {browserSync, gutil, gulpIf} = plugins;
    const {log, colors} = gutil;
    const {
      sources,
      utils,
      environment,
      tasks
    } = config;
    const {assemble: taskConfig = {}} = tasks;
    const {data} = taskConfig;
    const {
      srcDir,
      buildDir,
      templating
    } = sources;
    const {dir: templateDir} = templating;
    const {blue, magenta} = colors;
    const logger = (prefix, message) => log(magenta(`[assemble: ${magenta(prefix)}] `) +  blue(message));
    const {addbase} = utils;
    const {isDev} = environment;
    const templatePath = addbase(srcDir, templateDir);
    const src = path.join(templatePath, 'pages/**/*.html');
    const readStats = async () => {
      const fps = await glob(
        addbase(buildDir, '*.json')
      );

      return new Promise((res, rej) => {
        asyncMap(fps, readJson, (err, results) => {
          if (err) return rej(err);

          const [main, global, ...integrityData] = results;
          const {assets: images, ...rest} = global;
          const integrity = integrityData.reduce((acc, json) => Object.assign(acc, json), {});
          const custom = {
            images,
            integrity
          };

          res(
            merge({}, main, rest, custom)
          );
        });
      });
    };

    return () => {
      if (isDev) {
        const watch = require('base-watch');

        app.use(watch());
      }

      return readStats().then(assets => {
        app.data(data);
        templateNunjucks(app, config);
        app.data({assets});
        app.onLoad(/\.html$/, frontMatterMiddleware);

        return new Promise((res, rej) => {
          app.task('build', () => {
            return app.src(src)
            .pipe(app.renderFile())
            .pipe(app.dest(buildDir))
            .on('data', (file) => {
              logger('render',  renameKey(file.path));
            })
            .pipe(
              gulpIf(isDev, browserSync.stream())
            )
            .on('error', console.error.bind(console, '[assemble]: build'));
          });

          app.build(['build'], (err) => {
            if (err) return rej(err);

            if (isDev) {
              const watchBase = path.join(templatePath, '**/*.{html,yml}');

              app.watch(watchBase, ['build']);

              logger('watch', watchBase);
            }

            res();
          });
        }).catch(err => {
          console.error('[assemble]', err.message, err.stack);
        });
      });
    };
  }
}
