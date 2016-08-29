import register from 'babel-register';

register({
  plugins: require.resolve('babel-plugin-rewire')
});
