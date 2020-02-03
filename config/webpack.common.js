const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const paths = require('./paths');

module.exports = {
  context: paths.absInput,
  entry: {
    index: [`./${paths.input}/index`, `./${paths.input}/index.scss`],
  },
  output: {
    path: paths.absOutput,
    filename: `${paths.output}/[name].bundle.js`,
  },
  module: {
    rules: [
      // Scripts

      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },

      // Markup

      {
        test: /\.pug$/,
        loader: 'pug-loader',
        options: { pretty: true },
      },

      // Favicons

      {
        test: /\.(png|svg)$/i,
        include: paths.absFavicons,
        loader: 'file-loader',
        options: { name: '[path][name].[ext]' },
      },
    ],
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
    }),
    new HtmlWebpackPlugin({
      template: `${paths.input}/index.pug`,
      filename: `${paths.output}/index.html`,
      hash: false,
      inject: false,
      minify: false,
      currentEnv: process.env.NODE_ENV,
    }),
  ],
};
