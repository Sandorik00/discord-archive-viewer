const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  entry: './src/main.tsx',
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: 'src/main.html',
      filename: '[name].html?[contenthash]',
    }),
  ],
  devtool: 'inline-source-map',
  devServer: {
    contentBase: false,
    compress: true,
    port: 8080
  },
  module: {
    rules: [
      {
        test: /\.(?:js|ts)x?$/,
        use: 'ts-loader',
        include: path.join(__dirname, 'src'),
        exclude: [/node_modules/, /src\/backend/],
      },
      {
        test: /\.s[ac]ss$/i,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', 'jsx'],
    modules: ['node_modules'],
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
};
