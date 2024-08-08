const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const config = require('dotenv').config();
const webpack = require('webpack');

console.log('Node env: ', process.env.NODE_ENV);
console.log('Hosted port: ', process.env.PORT);
console.log('Host: ', process.env.HOST);

module.exports = {
    entry: {
        main: './src/index.js',
        login: './src/components/Login.js',
        contact: './src/components/Contact.js',
        qrcode: './src/components/Qrcode.js',
    },
    mode: process.env.NODE_ENV,
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'build')
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
            }
        ]
    },
   /* resolve: {
        fallback: {
            crypto: require.resolve("crypto-browserify"),
            vm: require.resolve("vm-browserify"),
            path: require.resolve("path-browserify"),
            https: require.resolve("https-browserify"),
            url: require.resolve("url"),
            assert: require.resolve("assert"),
            http: require.resolve("stream-http"),
            stream: require.resolve("stream-browserify")
        },
        extensions: [".jsx", ".js"]
    },*/
    plugins: [
        new HtmlWebpackPlugin({
            template: './public/index.html'
        }),
    ],
    devtool: 'eval-source-map',
    devServer: {
        static: path.resolve(__dirname, 'public'),
        compress: true,
        port: process.env.PORT || 3002,
        historyApiFallback: true,
        open: true,
        host: process.env.HOST
    },
    optimization: {
        splitChunks: {
            chunks: 'all',
            minSize: 20000,     // Minimum size for a chunk to be generated
            maxSize: 70000,     // Maximum size for a chunk to be generated
            minChunks: 1,       // Minimum number of chunks that must share a module before splitting
            automaticNameDelimiter: '~', // Delimiter for naming chunks
            cacheGroups: {
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'all'
                },
                default: {
                    minChunks: 2,
                    priority: -20,
                    reuseExistingChunk: true,
                },
            },
        },
    },
    performance:
        {
            hints: false,
            maxEntrypointSize:
                412000,
            maxAssetSize:
                412000,
        },
};