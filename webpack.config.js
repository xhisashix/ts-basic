const path = require('path')
const CopyPlugin = require('copy-webpack-plugin')

module.exports = {
  entry: {
    omikuji: './src/ts/omikuji.ts',
    janken: './src/ts/janken.ts',
    calc: './src/ts/calc.ts',
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js',
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  devServer: {
    //contentBase: path.join(__dirname, 'dist'),
    static: {
      directory: path.resolve(__dirname, './dist'),
    },
    open: true,
  },
  module: {
    rules: [
      {
        loader: 'ts-loader',
        test: /\.ts$/,
      },
    ],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: 'src/index.html',
          to: 'index.html',
        },
        {
          from: 'src/janken.html',
          to: 'janken.html',
        },
        {
          from: 'src/calc.html',
          to: 'calc.html',
        },
      ],
    }),
  ],
}
