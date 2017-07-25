module.exports = {
  entry: [
    'webpack-dev-server/client?http://localhost:8080',
    'webpack/hot/only-dev-server',
    './src/index.js'
  ],
  module: {
    loaders: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loader: 'react-hot-loader!babel-loader'
      },
      { test: /\.(png|jpg|gif)$/, 
      loader: 'file-loader?name=./images/[name].[ext]'
    }]
  },
  resolve: {
    extensions: ['*', '.js', '.jsx']
  },
  output: {
    path: __dirname + '/dist',
    publicPath: '/',
    filename: 'bundle.js'
  },
  devServer: {
    proxy: {
      '/api/**': {
        target: 'http://localhost:1234',
        secure: false,
        changeOrigin: true
      }
    },
    contentBase: './dist',
    hot: true,
    historyApiFallback: true,
  },
};