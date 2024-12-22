const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const Dotenv = require('dotenv-webpack');
const dotenv = require('dotenv');

// Load environment variables from .env file
const config = dotenv.config();

console.log('Node env: ', process.env.NODE_ENV);
console.log('Hosted port: ', process.env.PORT);
console.log('Host: ', process.env.HOST);

module.exports = {
  entry: {
    main: './src/index.js',
    login: './src/components/Login.js',
    contact: './src/components/Contact.js',
    qrcode: './src/components/Qrcode.js',
    stripe: './src/components/StripePayment.js',
    vendor: ['react', 'react-dom'],
  },
  output: {
    filename: '[name].[contenthash].js',
    chunkFilename: '[name].[contenthash].bundle.js',
    path: path.resolve(__dirname, 'build'),
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader']
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[path][name].[ext]',
            },
          },
        ],
      },
    ]
  },
  stats: {
    errorDetails: true,
    warnings: true
  },
  devServer: {
    historyApiFallback: true,
    port: process.env.PORT,
    host: process.env.HOST,
    hot: true
  },
  mode: process.env.NODE_ENV || 'development',
  resolve: {
    extensions: ['.js', '.json'],
    fallback: {
      os: false,
      path: false,
      crypto: false,
      stream: false,

    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      chunks: ['vendor', 'main', 'login', 'contact', 'qrcode', 'login'] // Specify the chunks to include
    }),
    new Dotenv({path: '.env'}),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      'process.env.PORT': JSON.stringify(process.env.PORT),
      'process.env.HOST': JSON.stringify(process.env.HOST),
      /*
                  'process.env.SEND_EMAIL_URL': JSON.stringify(process.env.SEND_EMAIL_URL),
                  'process.env.BASE_URL': JSON.stringify(process.env.BASE_URL),
                  'process.env.SAVE_CONTACT_URL': JSON.stringify(process.env.SAVE_CONTACT_URL),
      */
    }),
    new webpack.HotModuleReplacementPlugin(),
  ],
  devtool: 'eval-source-map',
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        default: false,
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
          enforce: true,
        },
        common: {
          name: 'common',
          minChunks: 2,
          chunks: 'async',
          priority: 10,
          reuseExistingChunk: true,
          enforce: true,
        },
      },
    },
  },
  performance:
    {
      hints: false,
      maxEntrypointSize:
        312000,
      maxAssetSize:
        312000,
    },
};