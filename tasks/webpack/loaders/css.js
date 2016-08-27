import kind from 'kind-of';
import ExtractTextPlugin from 'extract-text-webpack-plugin';

/**
 * Make the CSS loaders for both a JS and SCSS build
 * @param {Object} config gulp-boiler config
 * @param {Object} opts options constructed in task function
 * @return {Array} css and scss loaders
 */
export default function(config, opts) {
  const {environment} = config;
  const {isDev} = environment;
  const {taskConfig, target} = opts;
  const {includePaths = []} = taskConfig;
  const cssMinimize = isDev ? '-autoprefixer&-minimize' : '-autoprefixer&minimize';
  const cssParams = [
    '&sourceMap',
    cssMinimize
  ].join('&');
  const sassParams = [
    'sourceMap',
    'sourceMapContents=true',
    'outputStyle=expanded'
  ].join('&');
  let sassLoader, cssLoader;

  if (Array.isArray(includePaths)) {
    includePaths.forEach(fp => sassParams.push(`includePaths[]=${fp}`));
  } else if (kind(includePaths) === 'string') {
    sassParams.push(`includePaths[]=${includePaths}`);
  }

  if (target === 'node') {
    //todo add isomorphic asset replacement
  } else if (isDev) {
    switch (target) {
      case 'js':
        sassLoader = [
          'style-loader',
          `css-loader?importLoaders=2${cssParams}`,
          'postcss-loader',
          `sass-loader?${sassParams}`
        ].join('!');
        break;
      case 'css':
        sassLoader = ExtractTextPlugin.extract({
          fallbackLoader: 'style-loader',
          loader: [
            `css-loader?importLoaders=2${cssParams}`,
            'postcss-loader',
            `sass-loader?${sassParams}`
          ].join('!')
        });
        break;
    }

    cssLoader = [
      'style-loader',
      `css-loader?importLoaders=1&modules&localIdentName=[name]__[local]___[hash:base64:5]${cssParams}`,
      'postcss-loader'
    ].join('!');
  } else {
    cssLoader = ExtractTextPlugin.extract({
      fallbackLoader: 'style-loader',
      loader: [
        `css-loader?importLoaders=1&modules&localIdentName=[hash:base64:5]${cssParams}`,
        'postcss-loader'
      ].join('!')
    });

    sassLoader = ExtractTextPlugin.extract({
      fallbackLoader: 'style-loader',
      loader: [
        `css-loader?importLoaders=2${cssParams}`,
        'postcss-loader',
        `sass-loader?${sassParams}`
      ].join('!')
    });
  }

  const loaders = [
    {
      test: /\.css$/,
      exclude: /node_modules/,
      loader: cssLoader
    },
    {
      test: /\.scss$/,
      exclude: /node_modules/,
      loader: sassLoader
    }
  ];

  return {loaders};
}
