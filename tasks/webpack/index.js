import EventEmitter from 'events';
import kind from 'kind-of';
import webpack from 'webpack';
import makeConfig from './make-config';

export default class Webpack extends EventEmitter {
  task(gulp, plugins, config) {
    const {metaData, sources, utils, environment, tasks} = config;
    const {webpack: taskConfig} = tasks;
    const {hot = true} = taskConfig;
    const {isDev, assetPath} = environment;
    const {getTarget} = utils;
    const {buildDir, devPath: devHost, devPort, hotPort, bundler} = sources;
    const {
      jsBundle = 'main',
        cssBundle = 'main'
    } = bundler;
    const {gutil} = plugins;
    const {log, colors} = gutil;
    const {magenta, blue} = colors;
    const logger = (prefix, message) => log(magenta(`[webpack: ${magenta(prefix)}] `) +  blue(message));
    let publicPath;

    return (cb) => {
      const target = getTarget(metaData);
      const devPath = isDev ? `http://${devHost}:${hotPort}/` : '/';
      const bsPath = isDev ? `http://${devHost}:${devPort}/` : '/';

      if (hot) {
        publicPath = isDev ? devPath : assetPath;
      } else {
        publicPath = isDev ? bsPath : assetPath;
      }

      const webpackConfig = makeConfig(config, {
        target,
        publicPath,
        logger,
        hot,
        taskConfig,
        jsBundle,
        cssBundle
      });
      const compiler = webpack(webpackConfig);

      function compileLogger(err, stats) {
        if (err) {
          throw new gutil.PluginError({
            plugin: '[webpack]',
            message: err.message
          });
        }

        if (!isDev) {
          //log(stats.toString());
        }
      }

      compiler.plugin('compile', () => {
        logger('compile', `Webpack Bundling ${target} bundle`);
      });

      compiler.plugin('done', (stats) => {
        logger('done', `Webpack Bundled ${target} bundle in ${stats.endTime - stats.startTime}ms`);

        if (isDev && stats.hasErrors() || stats.hasWarnings()) {
          const {errors, warnings} = stats.compilation;
          let messages;

          if (errors.length === warnings.length) {
            messages = errors;
          } else {
            messages = [...errors, ...warnings];
          }

          messages.forEach(({message}) => log(message));
        }

        //avoid multiple calls of gulp callback
        if (kind(cb) === 'function') {
          let gulpCb = cb;

          cb = null;
          gulpCb();
        }
      });

      if (isDev) {
        if (hot && target === 'js') {
          const Express = require('express');
          const middleware = require('webpack-dev-middleware');
          const hotMiddleware = require('webpack-hot-middleware');
          const app = new Express();
          const serverOptions = {
            contentBase: buildDir,
            quiet: true,
            noInfo: true,
            hot: true,
            inline: true,
            lazy: false,
            publicPath,
            headers: {'Access-Control-Allow-Origin': '*'},
            stats: {colors: true}
          };
          let hasRun = false;

          app.use(middleware(compiler, serverOptions));
          app.use(hotMiddleware(compiler));

          compiler.plugin('done', (stats) => {
            if (!hasRun) {
              app.listen(hotPort, (err) => {
                if (err) {
                  console.error(err);
                } else {
                  console.info('==> 🚧  Webpack development server listening on port %s', hotPort);
                }

                hasRun = true;
              });
            }
          });
        } else {
          compiler.watch({
            aggregateTimeout: 300,
            poll: true
          }, compileLogger);
        }
      } else {
        compiler.run(compileLogger);
      }
    };
  }
}
