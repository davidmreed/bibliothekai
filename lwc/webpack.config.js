const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
    entry: {
        addPublishedReview: './src/addPublishedReview.js',
        addPerson: './src/addPerson.js'
    },
    output: {
        filename: '[name].js'
    },
    optimization: {}
    /* plugins: [
         new HtmlWebpackPlugin({
             filename: 'addPublishedReview.html',
             template: 'addPublishedReview.html',
             chunks: ['addPublishedReview']
         })
     ]*/
};
