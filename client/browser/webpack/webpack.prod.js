let common = require('./webpack.common')
const BabiliPlugin = require('babili-webpack-plugin');
const merge = require('webpack-merge')

let config = merge.smart(common, {
  output: {
    filename: 'bitbucket-client.prod.js'
  },
  plugins: [
    new BabiliPlugin(),
  ]
})

module.exports = config
