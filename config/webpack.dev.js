const merge = require('webpack-merge');

const common = require('./webpack.common');
const dirs = require('./dirs');
const { complitionLogHook, projectInfoHook } = require('./hooks');
const { projectName, getNetworkIp, getAvailabelPort } = require('./utils');

const config = {
  mode: 'development',
  devtool: 'eval',
  devServer: {
    contentBase: dirs.output.relativeName,
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
  plugins: [],
};

module.exports = async () => {
  const protocol = 'http';
  const domain = 'localhost';
  const networkIp = getNetworkIp();
  const port = await getAvailabelPort();
  const url = `${protocol}://${domain}:${port}`;
  const localUrl = networkIp && `${protocol}://${networkIp}:${port}`;

  config.devServer.port = port;
  config.devServer.public = url;

  config.plugins.push({
    apply: (compiler) => {
      compiler.hooks.entryOption.tap('compilationLog', complitionLogHook);
      compiler.hooks.done.tap('projectInfo', () => projectInfoHook({ projectName, localUrl, url }));
    },
  });

  return merge(common, config);
};
