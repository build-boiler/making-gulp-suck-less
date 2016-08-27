import path from 'path';
import SriStatsPlugin from 'sri-stats-webpack-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import webpack from 'webpack';

/**
 * Make da plugins for js, css, and node builds
 * @param {Object} config gulp-boiler config
 * @param {Object} opts options constructed in task function
 * @return {Object} webpack config to be passed to `webpack`
 */
export default function(config, opts) {
  const {
    target,
    tools,
    taskConfig
  } = opts;
  const {environment, sources, utils} = config;
  const {
    integrity = true,
    multipleBundles,
    define = {},
    provide = {}
  } = taskConfig;
  const {buildDir} = sources;
  const {isDev, env} = environment;
  const {addbase} = utils;
  const defined = {
    'process.env': {
      NODE_ENV: JSON.stringify(env),
      ...define
    }
  };
  const {DefinePlugin, NoErrorsPlugin, ProvidePlugin, optimize} = webpack;
  const {OccurenceOrderPlugin, OccurrenceOrderPlugin, DedupePlugin, UglifyJsPlugin} = optimize;
  //prepare for Webpack 2
  const PluginFn = OccurenceOrderPlugin || OccurrenceOrderPlugin;
  const plugins = [
    new PluginFn(),
    new DefinePlugin(defined),
    new NoErrorsPlugin(),
    new ProvidePlugin(provide),
    tools
  ];
  const cssFileName = path.join('css', isDev ? '[name].css' : '[name]-[chunkhash].css');

  switch (target) {
    case 'js':
      if (isDev) {
        plugins.push(
          new webpack.HotModuleReplacementPlugin()
        );
      } else {
        plugins.push(...[
          new ExtractTextPlugin({
            filename: cssFileName,
            allChunks: true
          }),
          new DedupePlugin(), //breaking in Webpack 2 with CommonChuncks https://github.com/webpack/webpack/issues/2764
          new UglifyJsPlugin({
            output: {
              comments: false
            },
            compress: {
              warnings: false
            }
          })
        ]);
      }

      if (multipleBundles) {
        const jsBundleName = isDev ? '[name].js' : '[name]-[chunkhash].js';
        const {CommonsChunkPlugin} = webpack.optimize;
        const commons = new CommonsChunkPlugin({
          name: 'vendors',
          filename: path.join('js', jsBundleName),
          minChunks: Infinity
        });

        plugins.push(commons);
      }
      break;
    case 'css':
      plugins.push(
        new ExtractTextPlugin({
          filename: cssFileName,
          allChunks: true
        })
      );
      break;
  }

  if (integrity) {
    plugins.push(
      new SriStatsPlugin({
        algorithm: 'sha512',
        allow: /\.(js|css)$/i,
        assetKey: 'integrity',
        saveAs: addbase(buildDir, `subresource-integrity-${target}.json`),
        write: true
      })
    );
  }

  return plugins;
}
