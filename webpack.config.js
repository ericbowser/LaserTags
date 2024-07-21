const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const dotenv = require('dotenv').config();
const webpack = require('webpack');

console.log('Node env: ', process.env.NODE_ENV)
console.log('Hosted port: ', process.env.PORT)

module.exports = {
    entry: './src/index.js',
    mode: process.env.NODE_ENV,
    output: {
        filename: 'bundle.js',
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
    plugins: [
        new HtmlWebpackPlugin({
            template: './public/index.html'
        }),
        new Dotenv(),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
            'process.env.PORT': JSON.stringify(process.env.PORT),
        }),
    ],
    devtool: 'eval-source-map',
    devServer: {
        static: path.resolve(__dirname, 'public'),
        compress: true,
        port: process.env.PORT || 3002,
        historyApiFallback: true,
        open: true,
        host: 'localhost'
    }
};