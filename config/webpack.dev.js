const merge = require('webpack-merge');
const common = require('./webpack.common');
const { complitionLogHook, projectInfoHook } = require('./hooks');

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
        compiler.hooks.entryOption.tap('compilationLog', complitionLogHook);
        compiler.hooks.done.tap('projectInfo', () => projectInfoHook({ projectName, localUrl, url }));
      },
    },
  ],
});
