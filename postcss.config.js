const isProdEnv = process.env.NODE_ENV === 'production';

module.exports = {
  plugins: {
    autoprefixer: {},
    cssnano: isProdEnv ? {} : false,
  },
};
