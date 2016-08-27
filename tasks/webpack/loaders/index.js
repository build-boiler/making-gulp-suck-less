import getCssLoaders from './css';

/**
 * Make da JS loaders and base asset/file loaders
 * @param {Object} config gulp-boiler config
 * @param {Object} opts options constructed in task function
 * @return {Object} preLoaders, loaders, and postLoaders
 */
export default function(config, opts) {
  const {tools, taskConfig, target} = opts;
  const {expose = []} = taskConfig;
  const {environment} = config;
  const {env} = environment;
  const fileLoader = 'file-loader?name=[path][name].[ext]';
  const babelrc = {
    presets: ['react', 'es2015', 'stage-0'],
    env: {
      development: {
        plugins: [
          'transform-decorators-legacy',
          'typecheck',
          ['react-transform',
            {
              transforms: [
                {
                  transform: 'react-transform-hmr',
                  imports: ['react'],
                  locals: ['module']
                },
                {
                  transform: 'react-transform-catch-errors',
                  imports: ['react', 'redbox-react']
                }
              ]
            }
          ]
        ]
      },
      production: {
        plugins: [
          'transform-decorators-legacy'
        ]
      }
    }
  };
  const {presets, env: babelEnv} = babelrc;
  const {plugins} = babelEnv[env];
  const preLoaders = [
    {
      test: /\.jsx?$/,
      exclude: [/node_modules/],
      loader: 'eslint-loader'
    }
  ];
  const loaders = [
    {
      test: /\.jsx$/,
      exclude: /node_modules/,
      loader: 'babel',
      query: {
        babelrc: false,
        presets,
        plugins
      }
    },
    {
      test: tools.regular_expression('images'),
      loader: fileLoader
    },
    {
      test: /\.(ico|ttf|eot|woff(2)?)(\?[a-z0-9]+)?$/,
      loader: fileLoader
    },
    {
      test: /\.json$/,
      loader: 'json'
    }
  ];
  const postLoaders = [];

  if (target === 'js') {
    Object.keys(expose).forEach((modName) => {
      postLoaders.push({
        test: require.resolve(modName),
        loader: `expose?${expose[modName]}`
      });
    });
  }

  const jsLoaders = {
    preLoaders,
    loaders,
    postLoaders
  };

  const cssLoaders = getCssLoaders(config, opts);

  return  Object.keys(cssLoaders).reduce((acc, key) => {
    const cssLoader = cssLoaders[key];

    if (Array.isArray(cssLoader) && Array.isArray(acc[key])) {
      acc[key].push(...cssLoader);
    }

    return acc;
  }, jsLoaders);
}
