const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const merge = require('webpack-merge');
const common = require('./webpack.common');

module.exports = merge(common, {
  mode: 'production',
  module: {
    rules: [
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
          { loader: MiniCssExtractPlugin.loader, options: { publicPath: '../' } },
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
    new MiniCssExtractPlugin({ filename: '[name].min.css' }),
  ],
});
