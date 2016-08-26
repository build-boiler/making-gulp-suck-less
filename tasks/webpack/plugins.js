import webpack from 'webpack';

export default function(config, opts) {
  const devPlugins = [
    new webpack.HotModuleReplacementPlugin()
  ];
  //if (!quick) {
    //prodConfig.plugins.push(...[
      //new webpack.optimize.DedupePlugin(),
      //new webpack.optimize.UglifyJsPlugin({
        //output: {
          //comments: false
        //},
        //compress: {
          //warnings: false
        //}
      //})
    //]);
  //}
}
