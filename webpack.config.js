const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
const webpack = require('webpack');

const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const ErrorOverlayPlugin = require('error-overlay-webpack-plugin');
const LwcWebpackPlugin = require('lwc-webpack-plugin');

const mode = process.env.NODE_ENV || 'production';

module.exports = {
    entry: {
        addPublishedReview: './src/addPublishedReview.js',
        addVolume: './src/addVolume.js',
        translationView: './src/translationView.js',
        compareTranslations: './src/compareTranslations.js'
    },
    mode,
    output: {
        path: path.join(__dirname, './dist'),
        filename: '[name].js'
    },
    plugins: [
        new WebpackManifestPlugin({ publicPath: '' }),
        new webpack.EnvironmentPlugin({
            ENDPOINT: 'http://127.0.0.1:8000'
        }),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(mode)
        }),
        new LwcWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: path.join(__dirname, './src/index.html')
        })
    ]
};
