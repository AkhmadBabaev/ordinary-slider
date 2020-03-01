const HtmlWebpackPlugin = require('html-webpack-plugin');

const paths = require('./paths');

module.exports = {
  context: paths.absInput,
  entry: {
    index: [`./${paths.input}/index`, `./${paths.input}/index.scss`],
    'o-slider': [`./${paths.input}/plugin/o-slider`, `./${paths.input}/plugin/o-slider.scss`],
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
  resolve: {
    extensions: ['.ts', '.js'],
  },
  plugins: [
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
