// Important modules this config uses
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = require('./webpack.base.babel')({
    // In production, we skip all hot-reloading stuff
    entry: {
        vendor: 'babel-polyfill',
        common: path.join(process.cwd(), 'app/project-files/scripts/common.js'),
    },
    devtool: 'source-map',

    output: {
        path: path.resolve(process.cwd(), 'app/static/templates'),
        publicPath: 'https://forio.com/epicenter/builder/templates/',
        filename: '[name].min.js',
        libraryTarget: 'var',
        library: 'Project'
    },

    externals: {
        // require("jquery") is external and available
        //  on the global var jQuery
        jquery: '$'
    },

    // We use ExtractTextPlugin so we get a seperate CSS file instead
    // of the CSS being in the JS and injected as a style tag
    cssLoaders: ExtractTextPlugin.extract({
        notExtractLoader: 'style-loader',
        loader: 'css-loader?sourceMap!sass?sourceMap' 
    }),
    plugins: [
        // new webpack.ProvidePlugin({
        //     $: "jquery",
        //     jQuery: "jquery"
        // })
        
        new webpack.optimize.CommonsChunkPlugin({
            names: ['vendor'],
            // children: true,
            minChunks: Infinity, //TODO: understand what this means
            // async: true,
        }),
        // OccurrenceOrderPlugin is needed for long-term caching to work properly.
        // See http://mxs.is/googmv
        // new webpack.optimize.OccurrenceOrderPlugin(true),

        // Merge all duplicate modules
        new webpack.optimize.DedupePlugin(),

        // Minify and optimize the JavaScript
        // new webpack.optimize.UglifyJsPlugin({
        //     compress: {
        //         warnings: false, // ...but do not show warnings in the console (there is a lot of them)
        //     },
        // }),


        // Extract the CSS into a seperate file
        new ExtractTextPlugin('[name].min.css'),
    ],
});
