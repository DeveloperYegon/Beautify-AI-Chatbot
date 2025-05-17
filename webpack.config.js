// webpack.config.js
const webpack = require('webpack');
module.exports = {
  plugins: [
    new webpack.DefinePlugin({
      'import.meta.env.VITE_API_KEY': JSON.stringify(import.meta.env.VITE_API_KEY),
    }),
  ],
};