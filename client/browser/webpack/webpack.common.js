var path = require('path');
var webpack = require('webpack');

const rootPath = path.resolve(__dirname, '../')
const distPath = path.resolve(__dirname, '../dist')
const indexPath = path.resolve(__dirname, '../src/index.js')
const templatePath = path.resolve(__dirname, '../templates/sample.html')

module.exports = {
  entry: indexPath,
  output: {
    path: distPath,
    filename: 'bitbucket-client.js',
    library: 'api',
    libraryTarget: 'umd'
  },
  // see https://webpack.github.io/docs/webpack-dev-server.html#api
  devServer: {
    contentBase: distPath,
    hot: true,
    // compress: true,
    // filename: 'bundle.js',
    // watchOptions: {
    //   aggregateTimeout: 300,
    //   poll: 1000
    // },
    // It's a required option.
    // where to load extra assets from (root for the page)
    publicPath: assetsPath,
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Sample Bitbucket Auth app',
      // Load a custom template (lodash by default see the FAQ for details)
      template: templatePath,
    })
  ],
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /(node_modules|bower_components)/,
      use: {
        loader: 'babel-loader',
      }
    }]
  },
  stats: {
    colors: true
  },
  devtool: 'source-map'
};
