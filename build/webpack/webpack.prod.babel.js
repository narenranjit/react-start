// Important modules this config uses
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const OfflinePlugin = require('offline-plugin');
const pkg = require(path.join(process.cwd(), 'package.json'));

const deps = Object.keys(pkg.dependencies);
const externals = {
    lodash: {
        root: "_",
        commonjs: "lodash",
        commonjs2: "lodash",
        amd: "lodash"
     }
};

const vendor = deps;
// const vendor = deps.filter((dep)=> !externals[dep]);
console.log(vendor);
module.exports = require('./webpack.base.babel')({
  // In production, we skip all hot-reloading stuff
    entry: {
        vendor: vendor,
        main: path.join(process.cwd(), 'app/main.js'),
    },
    externals: externals,

  // Utilize long-term caching by adding content hashes (not compilation hashes) to compiled assets
  output: {
    libraryTarget: "umd",
    filename: '[name].[chunkhash].js',
    chunkFilename: '[name].[chunkhash].chunk.js',
  },

  // We use ExtractTextPlugin so we get a seperate CSS file instead
  // of the CSS being in the JS and injected as a style tag
  cssLoaders: ExtractTextPlugin.extract(
    'style-loader',
    'css-loader?sourceMap',
    'sass?sourceMap'
  ),

  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      names: ['vendor'],
      // children: true,
      minChunks: Infinity,
      // async: true,
    }),

    // OccurrenceOrderPlugin is needed for long-term caching to work properly.
    // See http://mxs.is/googmv
    new webpack.optimize.OccurrenceOrderPlugin(true),

    // Merge all duplicate modules
    new webpack.optimize.DedupePlugin(),

    // Minify and optimize the JavaScript
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false, // ...but do not show warnings in the console (there is a lot of them)
      },
    }),

    // Minify and optimize the index.html
    new HtmlWebpackPlugin({
      template: 'app/index.html',
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      },
      inject: true,
    }),

    // Extract the CSS into a seperate file
    new ExtractTextPlugin('[name].[contenthash].css'),

    // Put it in the end to capture all the HtmlWebpackPlugin's
    // assets manipulations and do leak its manipulations to HtmlWebpackPlugin
    new OfflinePlugin({
      // No need to cache .htaccess. See http://mxs.is/googmp,
      // this is applied before any match in `caches` section
      excludes: ['.htaccess'],

      caches: {
        main: [':rest:'],

        // All chunks marked as `additional`, loaded after main section
        // and do not prevent SW to install. Change to `optional` if
        // do not want them to be preloaded at all (cached only when first loaded)
        additional: ['*.chunk.js'],
      },

      // Removes warning for about `additional` section usage
      safeToUseOptionalCaches: true,

      AppCache: {
        // Starting from offline-plugin:v3, AppCache by default caches only
        // `main` section. This lets it use `additional` section too
        caches: ['main', 'additional'],
      },
    }),
  ],
});
