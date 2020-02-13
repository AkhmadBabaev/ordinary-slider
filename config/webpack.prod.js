const HtmlBeautifyPlugin = require('html-beautify-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const merge = require('webpack-merge');
const common = require('./webpack.common');

module.exports = merge(common, {
  mode: 'production',
  module: {
    rules: [
      // Scripts

      {
        enforce: 'pre',
        test: /\.(ts|js)$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
        options: { failOnError: true },
      },

      // Styles

      {
        test: /\.css$/,
        use: [
          { loader: MiniCssExtractPlugin.loader, options: { publicPath: '../' } },
          { loader: 'css-loader' },
          { loader: 'postcss-loader' },
        ],
      },

      {
        test: /\.(sa|sc)ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: { publicPath: '../' },
          },
          { loader: 'css-loader' },
          { loader: 'postcss-loader' },
          { loader: 'resolve-url-loader' },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
              sourceMapContents: false,
            },
          },
        ],
      },
    ],
  },
  stats: {
    all: false,

    errors: true,
    warnings: true,
    hash: true,
    builtAt: true,
  },
  plugins: [
    new HtmlBeautifyPlugin({
      config: {
        html: {
          indent_size: 2,
          indent_with_tabs: false,
          end_with_newline: true,
          unformatted: ['p', 'i', 'b', 'span'],
        },
      },
    }),
    new MiniCssExtractPlugin({
      filename: '[name].bundle.css',
    }),
  ],
});
