const HtmlWebpackPlugin = require('html-webpack-plugin');

const dirs = require('./dirs');

module.exports = {
  context: dirs.input.path,
  entry: {
    index: ['./preview/index', `./${dirs.assets.name}/${dirs.styles.name}/basic.scss`],
    'o-slider': ['./plugin/o-slider', './plugin/o-slider.scss'],
  },
  output: {
    path: dirs.output.path,
    filename: '[name].min.js',
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
      },

      // Favicons

      {
        test: /\.(png|jpe?g|gif|svg|ico|webmanifest|xml)$/i,
        include: dirs.favicons.path,
        loader: 'file-loader',
        options: { name: '[path][name].[ext]' },
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      '@components': dirs.components.path,
      '@favicons': dirs.favicons.path,
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      currentEnv: process.env.NODE_ENV,
      template: 'preview/index.pug',
      filename: 'index.html',
      inject: false,
      hash: false,
    }),
  ],
};
