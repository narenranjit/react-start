const webpackConfig = require('../webpack/webpack.test.babel');
const argv = require('minimist')(process.argv.slice(2));
const path = require('path');


module.exports = (config) => {
    const reporters = argv['auto-watch'] ? ['mocha'] : ['coverage', 'mocha'];
  config.set({
    frameworks: ['mocha'],
    reporters: reporters,
    browsers: ['PhantomJS'],

    autoWatch: false,
    singleRun: true,

    client: {
      mocha: {
        grep: argv.grep,
      },
    },

    files: [
      {
        pattern: './test-bundler.js',
        watched: false,
        served: true,
        included: true,
      },
    ],

    preprocessors: {
      ['./test-bundler.js']: ['webpack', 'sourcemap'], // eslint-disable-line no-useless-computed-key
    },

    webpack: webpackConfig,

    // make Webpack bundle generation quiet
    webpackMiddleware: {
      noInfo: true,
      stats: 'errors-only',
    },
    coverageReporter: {
      dir: path.join(process.cwd(), 'tests/coverage'),
      reporters: [
        { type: 'lcovonly', subdir: 'lcov' },
        { type: 'html', subdir: 'html' },
        { type: 'text-summary' },
      ],
    },

  });
};
