const path = require('path');

module.exports = {
  entry: './dist/src/sw.bundle.js',
  output: {
    filename: 'sw.bundle.js',
    path: path.resolve(__dirname, './')
  }
};