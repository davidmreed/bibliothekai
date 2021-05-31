const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
const webpack = require('webpack');

module.exports = {
    entry: {
        addPublishedReview: './src/addPublishedReview.js',
        addVolume: './src/addVolume.js',
        translationView: './src/translationView.js',
        compareTranslations: './src/compareTranslations.js'
    },
    output: {
        filename: '[name].js'
    },
    plugins: [
        new WebpackManifestPlugin({ publicPath: '' }),
        new webpack.EnvironmentPlugin({
            ENDPOINT: 'http://127.0.0.1:8000'
        })
    ]
};
