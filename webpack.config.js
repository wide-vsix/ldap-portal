const path = require('path');
require('babel-polyfill');

module.exports = {
  context: path.join(__dirname, './src'),
  entry: ['babel-polyfill', './render.jsx'],
  output: {
    path: path.join(__dirname, './public/'),
    publicPath: '/',
    filename: 'build.js',
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-react', '@babel/preset-env'],
          },
        },
      },
      {
        test: /\.(jpe?g|png|gif|svg|ico)(\?.+)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 1024,
              name: './img/[name].[ext]',
            },
          },
        ],
      },
    ],
  },
  plugins: [],
};
