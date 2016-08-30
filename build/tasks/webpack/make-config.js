import path from 'path';
import formatter from 'eslint-friendly-formatter';
import getLoaders from './loaders';
import getPlugins from './plugins';
import getTools from './isomorphic-tools';

/**
 * Make the Webpack config like `webpack.config.js`
 * @param {Object} config gulp-boiler config
 * @param {Object} opts options constructed in task function
 * @return {Object} webpack config to be passed to `webpack`
 */
export default function(config, opts) {
  const {
    sources,
    utils,
    environment
  } = config;
  const {srcDir, buildDir} = sources;
  const {
    hot,
    jsBundle,
    cssBundle,
    target,
    publicPath,
    taskConfig = {}
  } = opts;
  const {entry: entries = {}} = taskConfig;
  const {isDev} = environment;
  const {addbase} = utils;
  const tools = getTools(config, {target});
  const loaderPluginOpts = Object.assign({}, opts, {tools});
  const loaders = getLoaders(config, loaderPluginOpts);
  const plugins = getPlugins(config, loaderPluginOpts);
  const context = taskConfig.context || addbase(srcDir);
  const webpackConfig = {
    cache: isDev,
    debug: isDev,
    context,
    module: loaders,
    plugins,
    externals: taskConfig.externals,
    resolve: {
      alias: taskConfig.alias,
      extensions: [
        '',
        '.js',
        '.json',
        '.jsx',
        '.html',
        '.css',
        '.scss',
        '.yaml',
        '.yml'
      ]
    }
  };
  let entry, bundleName;

  switch (target) {
    case 'js':
      const hmrOpts = [
        `path=${publicPath}__webpack_hmr`,
        'reload=true'
      ];
      const hotEntry = hot && isDev ? [`webpack-hot-middleware/client?${hmrOpts.join('&')}`] : [];
      const configFile = require.resolve('../../../packages/eslint-config-gulpy-boiler');

      bundleName = isDev ? '[name].js' : '[name]-[chunkhash].js';

      entry = {
        [jsBundle]: [
          ...hotEntry,
          'babel-polyfill',
          './' + path.join('js', entries.js || 'index.js')
        ]
      };

      Object.assign(webpackConfig, {
        entry,
        output: {
          path: addbase(buildDir),
          publicPath,
          filename: path.join('js', bundleName)
        },
        devtool: 'source-map',
        eslint: {
          configFile,
          formatter,
          emitError: false,
          emitWarning: false,
          failOnWarning: !isDev,
          failOnError: !isDev
        }
      });
      break;
    case 'css':
      bundleName = isDev ? 'assets.css' : 'assets-[chunkhash].css';

      entry = {
        [cssBundle]: [
          './' + path.join('js', entries.assets || 'assets.js')
        ]
      };

      Object.assign(webpackConfig, {
        entry,
        output: {
          path: addbase(buildDir),
          publicPath,
          filename: path.join('js', bundleName)
        },
        devtool: 'source-map'
      });
      break;
    case 'node':
      entry = taskConfig.serverEntry;

      Object.assign(webpackConfig, {
        entry,
        output: {
          path: addbase(taskConfig.serverDir),
          publicPath,
          filename: taskConfig.serverBundle,
          libraryTarget: 'commonjs2'
        },
        target: 'node'
      });
      break;
  } // end `switch`

  return webpackConfig;
}
