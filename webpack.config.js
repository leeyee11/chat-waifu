const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.min.js',
    path: path.resolve(__dirname, 'dist'),
  },
  mode: 'production',
  optimization: {
    minimize: false,
    minimizer: [new TerserPlugin()],
  },
  resolve: {
    extensions: [".js"],
    alias: {
      "@framework":  path.resolve(__dirname, './public/lib/framework')
    }
  },
  plugins: [
    new CopyWebpackPlugin(
      {
        patterns: [
          {
            from: path.join(__dirname, 'public/index.html'),
            to: path.join(__dirname, 'dist/index.html')
          },
          {
            from: path.join(__dirname, 'public/lib/live2dcubismcore.min.js'),
            to: path.join(__dirname, 'dist/lib/live2dcubismcore.min.js')
          },
          {
            from: path.join(__dirname, 'public/assets'),
            to: path.join(__dirname, 'dist/assets')
          },
        ]
      })
  ]
}