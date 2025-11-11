const path = require('path');

module.exports = {
  mode: 'development',
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', { targets: { node: 'current' }, modules: 'auto' }],
              ['@babel/preset-react', { runtime: 'automatic' }],
              '@babel/preset-typescript'
            ]
          }
        },
        exclude: /node_modules/
      },
      // Transpile specific node_modules packages that ship modern syntax
      {
        test: /\.m?js$/,
        include: [
          path.resolve(__dirname, 'node_modules/@testing-library/react'),
          path.resolve(__dirname, 'node_modules/@testing-library/user-event'),
          path.resolve(__dirname, 'node_modules/@testing-library/jest-dom')
        ],
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', { targets: { browsers: ['last 2 Chrome versions'] } }]
            ]
          }
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json']
  }
};
