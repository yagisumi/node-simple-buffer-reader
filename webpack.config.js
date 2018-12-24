const path = require('path');

module.exports = {
  mode: 'production',

  entry: './lib/simple-buffer-reader.ts',
  output: {
    filename: 'simple-buffer-reader.js',
    path: path.resolve(__dirname, 'umd'),
    libraryTarget: 'umd',
    globalObject: `typeof self !== 'undefined' ? self : this`,
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
    ]
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ]
  },
};
