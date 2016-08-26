import path from 'path';
import webpack from 'webpack';

/**
 * Make da plugins for js, css, and node builds
 * @param {Object} config gulp-boiler config
 * @param {Object} opts options constructed in task function
 * @return {Object} webpack config to be passed to `webpack`
 */
export default function(config, opts) {
  const {toolsPlugin, taskConfig} = opts;
  const {environment} = config;
  const {
    target,
    multipleBundles,
    define = {},
    provide = {}
  } = taskConfig;
  const {isDev, env} = environment;
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
    new ProvidePlugin(provide)
  ];

  if (target === 'js' || target === 'css') {
    plugins.push(toolsPlugin);
  }

  if (target === 'js') {
    if (isDev) {
      plugins.push(
        new webpack.HotModuleReplacementPlugin()
      );
    } else {
      plugins.push(...[
        new DedupePlugin(),
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
  }

  return plugins;
}
