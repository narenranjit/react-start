/* eslint-disable global-require */
const express = require('express');
const path = require('path');
const compression = require('compression');
const pkg = require(path.resolve(process.cwd(), 'package.json'));
const proxy = require('http-proxy-middleware');
const _ = require('lodash');

// Dev middleware
const addDevMiddlewares = (app, webpackConfig)=> {
    const webpack = require('webpack');
    const webpackDevMiddleware = require('webpack-dev-middleware');
    const webpackHotMiddleware = require('webpack-hot-middleware');
    const compiler = webpack(webpackConfig);
    const middleware = webpackDevMiddleware(compiler, {
        noInfo: true,
        publicPath: webpackConfig.output.publicPath,
        silent: true,
        stats: 'errors-only',
    });

    app.use(middleware);
    app.use(webpackHotMiddleware(compiler));
    
    _.each(webpackConfig.proxy, (proxySettings, path)=> {
        app.use(path, proxy(proxySettings));
    });

    // const staticPath = path.resolve(process.cwd(), webpackConfig.output.staticPath);
    // console.log('static', staticPath);
    app.use(express.static(webpackConfig.output.staticPath));

    // Since webpackDevMiddleware uses memory-fs internally to store build
    // artifacts, we use it instead
    const fs = middleware.fileSystem;

    if (pkg.dllPlugin) {
        app.get(/\.dll\.js$/, (req, res)=> {
            const filename = req.path.replace(/^\//, '');
            res.sendFile(path.join(process.cwd(), pkg.dllPlugin.path, filename));
        });
    }

    app.get('/', (req, res)=> {
        fs.readFile(path.join(compiler.outputPath, 'index.html'), (err, file)=> {
            if (err) {
                res.sendStatus(404);
            } else {
                res.send(file.toString());
            }
        });
    });
};

// Production middlewares
const addProdMiddlewares = (app, options)=> {
    const publicPath = options.publicPath || '/';
    const outputPath = options.outputPath || path.resolve(process.cwd(), 'dist');

    // compression middleware compresses your server responses which makes them
    // smaller (applies also to assets). You can read more about that technique
    // and other good practices on official Express.js docs http://mxs.is/googmy
    app.use(compression());
    app.use(publicPath, express.static(outputPath));

    app.get('/', (req, res)=> res.sendFile(path.resolve(outputPath, 'index.html')));
};

module.exports = (app, options)=> {
    const isProd = process.env.NODE_ENV === 'production';

    if (isProd) {
        addProdMiddlewares(app, options);
    } else {
        addDevMiddlewares(app, options.webpackConfig);
    }
    return app;
};
