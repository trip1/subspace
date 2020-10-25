const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const TerserPlugin = require('terser-webpack-plugin'); 
const CompressionPlugin = require("compression-webpack-plugin");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
require("@babel/polyfill");

const config = {
  entry: ["@babel/polyfill", './src/client/index.js'],
  mode: 'production',
  target: 'web',
  node: {
    fs: 'empty'
  },
  output: {
    path: path.resolve('prod'),
    filename: '[name].[contenthash].js'
  },
  optimization: {
    minimize: true,
    // minimizer: [new TerserPlugin()],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: './src/client/index.html',
      filename: 'index.html',
      inject: 'body',
      
    }),
    new CompressionPlugin({
        algorithm: 'gzip',
        test: /\.(js|css|html|svg)$/,
        cache: true,
        filename: '[name][ext].gz'
      }),
    new CompressionPlugin({
      algorithm: 'brotliCompress',
      test: /\.(js|css|html|svg)$/,
      cache: true,
      filename: '[name][ext].br',
      compressionOptions: { level: 11 },
    }),
  ],
  module: {
    rules: [
      { test: /\.jsx?$/, loader: 'babel-loader', exclude: /node_modules/, resolve: {extensions: ['.js', '.jsx']}},
      { test: /\.css$/, loader: ['style-loader', 'css-loader'] },
    ]
  }
}

module.exports = config;
