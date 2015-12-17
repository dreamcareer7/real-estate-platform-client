// webpack.config.js
var webpack = require('webpack')

var loaders = ['babel']
if(process.env.NODE_ENV === 'development')
  loaders = ['react-hot','babel']
var path = require('path')
var ExtractTextPlugin = require('extract-text-webpack-plugin')

// Default loaders
var loaders_module = [
  {
    test: /\.js$/,
    loaders: loaders,
    exclude: /node_modules/
  },
  {
    test: /\.scss$/,
    loader: ExtractTextPlugin.extract('style', 'css!sass')
  }
]

// Development loaders
if(process.env.NODE_ENV === 'development'){
  var es_lint = {
    test: /\.js$/, 
    loader: 'eslint-loader',
    exclude: /node_modules/
  }
  loaders_module.push(es_lint)
}

module.exports = {
  devServer: {
    port: process.env.DEV_PORT
  },
  entry: './app/app-client.js',
  output: {
    path: path.join(__dirname, 'app/public/dist'),
    filename: 'bundle.js',
    publicPath: '/dist/'
  },
  module: {
    loaders: loaders_module
  },
  plugins: [
    new ExtractTextPlugin('css/main.css'),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    }),
 ]
}