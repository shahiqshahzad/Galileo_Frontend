const webpack = require('webpack');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Set up polyfills
      // webpackConfig.resolve.fallback = {
      //   ...webpackConfig.resolve.fallback,
      //   crypto: require.resolve('crypto-browserify'),
      //   stream: require.resolve('stream-browserify'),
      //   buffer: require.resolve('buffer'),
      // };

      webpackConfig.ignoreWarnings = [
        (warning) =>
          warning.message.includes('Failed to parse source map')
      ];

      // Add ProvidePlugin to inject process and Buffer
      webpackConfig.plugins = (webpackConfig.plugins || []).concat([
        new NodePolyfillPlugin({
          additionalAliases: ['process'],
        }),
        new webpack.ProvidePlugin({
          process: 'process/browser',
          Buffer: ['buffer', 'Buffer'],
        })
      ]);

      // Exclude specific package from source-map-loader
      webpackConfig.module.rules.push({
        test: /\.js$/,
        enforce: 'pre',
        use: ['source-map-loader']
      });

      return webpackConfig;
    },
  },
};
