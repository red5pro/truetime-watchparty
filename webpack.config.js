/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')
const webpack = require('webpack')
const pkg = require('./package.json')
const ESLintPlugin = require('eslint-webpack-plugin')

const dfn = new webpack.DefinePlugin({
  WP_VERSION: JSON.stringify(pkg.version),
})

module.exports = {
  entry: path.resolve(__dirname, './src/index.js'),
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['*', '.js', '.jsx', '.ts', '.tsx'],
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'bundle.js',
  },
  plugins: [new webpack.HotModuleReplacementPlugin(), new ESLintPlugin(), dfn],
  devServer: {
    static: path.resolve(__dirname, './dist'),
    hot: true,
  },
  devtool: 'source-map',
}
