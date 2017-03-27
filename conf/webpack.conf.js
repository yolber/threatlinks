const webpack = require('webpack');
const conf = require('./gulp.conf');
const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const autoprefixer = require('autoprefixer');

module.exports = {
  module: {
    loaders: [
      {
        test: /.json$/,
        loaders: [
          'json'
        ]
      },
      {
        test: /\.(css|scss)$/,
        loaders: [
          'style',
          'css',
          'sass',
          'postcss'
        ]
      },

      {
        test: /\.(png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)$/,
        loader: 'file-loader'
      },
      /*{
       test: /sigma.*\.js?$/, // the test to only select sigma files
       exclude: ['src'], // you ony need to check node_modules, so remove your application files
       loaders: ['script'] // loading as script
     },*/
      {
       loader: 'imports?window,HTMLElement',
       test: require.resolve('sigma')
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loaders: [
          'ng-annotate',
          'babel'
        ]
      }]
  },
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.ProvidePlugin({
        dc: 'dc',
        d3: 'd3'
    }),

    new HtmlWebpackPlugin({  // Also generate a test.html
      filename: 'dnsgraphs.html',
      template: conf.path.src('graphs.html'),
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: conf.path.src('index.html'),
      inject: true
    }), // Generates default index.html

    /*new HtmlWebpackPlugin({
      template: conf.path.src('index.html'),
      inject: true
    })*/
  ],
  externals: {
    window: 'window',
    HTMLElement: 'HTMLElement'
  },
  postcss: () => [autoprefixer],
  debug: true,
  devtool: 'cheap-module-eval-source-map',
  output: {
    path: path.join(process.cwd(), conf.paths.tmp),
    filename: 'index.js'
  },
  entry: {
    pageMain: `./${conf.path.src('index')}`
  }
};
