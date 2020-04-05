const HtmlWebpackPlugin = require('html-webpack-plugin');

const paths = require('./paths');

module.exports = {
  context: paths.absInput,
  entry: {
    index: [
      `${paths.input}/preview/index`,
      `${paths.input}/${paths.auxiliary}/${paths.styles}/_basic.scss`,
    ],
    'o-slider': [
      `${paths.input}/plugin/o-slider`,
      `${paths.input}/plugin/o-slider.scss`,
    ],
  },
  output: {
    path: paths.absOutput,
    filename: `${paths.output}/[name].min.js`,
  },
  module: {
    rules: [
      // Scripts

      {
        test: /\.(ts|js)$/,
        exclude: /node_modules/,
        loader: 'ts-loader',
      },

      // Markup

      {
        test: /\.pug$/,
        loader: 'pug-loader',
        options: { root: paths.absInput },
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
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      '@components': paths.absComponents,
      '@favicons': paths.absFavicons,
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: `${paths.input}/preview/index.pug`,
      filename: `${paths.output}/index.html`,
      currentEnv: process.env.NODE_ENV,
      inject: false,
      hash: false,
    }),
  ],
};
