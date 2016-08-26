import path from 'path';
import formatter from 'eslint-friendly-formatter';
import makeEslintConfig from 'boiler-config-eslint';
import getLoaders from './loaders';
import getPlugins from './plugins';

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
    jsBundle,
    cssBundle,
    target,
    publicPath,
    taskConfig
  } = opts;
  const {isDev} = environment;
  const {addbase} = utils;
  const loaders = getLoaders(config, {target, taskConfig});
  const plugins = getPlugins(config, {target, taskConfig});
  const context = taskConfig.context || addbase(srcDir);
  const defaultConfig = {
    cache: isDev,
    debug: isDev,
    context,
    loaders,
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

  Object.assign(defaultConfig, {
    module: loaders,
    plugins
  });

  switch (target) {
    case 'js':
      const hmrOpts = [
        `path=${publicPath}__webpack_hmr`,
        'reload=true'
      ];
      const hotEntry = [
        `webpack-hot-middleware/client?${hmrOpts.join('&')}`
      ];
      const eslintConfig = {
        isDev,
        lintEnv: 'web',
        basic: false,
        react: true
      };
      const {rules, configFile} = makeEslintConfig(eslintConfig);
      bundleName = isDev ? '[name].js' : '[name]-[chunkhash].js';

      entry = {
        [jsBundle]: [
          hotEntry,
          path.join('js', taskConfig.entry || 'index.js')
        ]
      };

      Object.assign(defaultConfig, {
        entry,
        output: {
          path: addbase(buildDir),
          publicPath,
          filename: path.join('js', bundleName)
        },
        devtool: 'source-map',
        eslint: {
          rules,
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
      bundleName = isDev ? '[name].css' : '[name]-[chunkhash].css';

      entry = {
        [cssBundle]: [
          taskConfig.entry || path.join('scss', 'main.scss')
        ]
      };

      Object.assign(defaultConfig, {
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

      Object.assign(defaultConfig, {
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
  } //end `switch`
}
