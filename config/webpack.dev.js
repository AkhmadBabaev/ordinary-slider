/* eslint-disable no-console */
const merge = require('webpack-merge');
const chalk = require('chalk');
const common = require('./webpack.common');

const paths = require('./paths');
const {
  port,
  url,
  localUrl,
  projectName,
} = require('./utils');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'eval',
  devServer: {
    contentBase: paths.output,
    public: url,
    port,
    host: '0.0.0.0',
    progress: true,
    noInfo: true,
  },
  module: {
    rules: [
      // Styles

      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader', options: { sourceMap: true } },
          { loader: 'postcss-loader', options: { sourceMap: true } },
          { loader: 'resolve-url-loader', options: { sourceMap: true } },
          { loader: 'sass-loader', options: { sourceMap: true } },
        ],
      },
    ],
  },
  stats: {
    all: false,

    errors: true,
    warnings: true,
  },
  plugins: [
    {
      apply: (compiler) => {
        compiler.hooks.entryOption.tap('start', () => {
          console.clear();
          console.log(chalk.yellow('Compilation in progress...\n'));
        });

        compiler.hooks.done.tap('finish', () => {
          const data = {
            name: {
              content: projectName || 'not found',
              color: projectName ? 'green' : 'red',
            },
            network: {
              content: localUrl || 'not found',
              color: localUrl ? 'blue' : 'red',
            },
          };

          console.clear();
          console.log();
          console.log(`Name:                ${chalk[data.name.color](data.name.content)}`);
          console.log();
          console.log(`Local:               ${chalk.blue(url)}`);
          console.log(`Network:             ${chalk[data.network.color](data.network.content)}`);
          console.log();
        });
      },
    },
  ],
});
