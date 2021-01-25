const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
const webpack = require('webpack');

module.exports = {
    entry: {
        addPublishedReview: './src/addPublishedReview.js',
    },
    output: {
        filename: '[name].js',
    },
    plugins: [
        new WebpackManifestPlugin(),
        new webpack.EnvironmentPlugin({
            ENDPOINT: 'http://127.0.0.1:8000/api'
        })
    ]
}