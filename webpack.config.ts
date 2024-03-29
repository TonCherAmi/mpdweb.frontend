import * as Path from 'path'
import * as Webpack from 'webpack'
import WebpackDevServer from 'webpack-dev-server'

import HtmlWebpackPlugin from 'html-webpack-plugin'
import CopyWebpackPlugin from 'copy-webpack-plugin'
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin'

const src = Path.resolve(__dirname, 'app')

const DEV_BACKEND_TARGET = 'http://127.0.0.1:9898'

const devServer: WebpackDevServer.Configuration = {
  hot: 'only',
  host: '0.0.0.0',
  historyApiFallback: {
    disableDotRule: true,
  },
  proxy: {
    '/api': {
      target: DEV_BACKEND_TARGET,
    },
    '/api/ws': {
      ws: true,
      target: DEV_BACKEND_TARGET,
    },
  },
}

export default (_env: unknown, argv: { mode: string | undefined }): Webpack.Configuration => {
  const isDevelopment = argv.mode === 'development'

  const copyWebpackPlugin = new CopyWebpackPlugin({
    patterns: [
      'assets/images',
      'assets/mpdweb.webmanifest',
    ],
  })

  const htmlWebpackPlugin = new HtmlWebpackPlugin({
    template: 'index.html',
  })

  const plugins = !isDevelopment ? [htmlWebpackPlugin, copyWebpackPlugin] : [
    htmlWebpackPlugin,
    copyWebpackPlugin,
    new ReactRefreshWebpackPlugin(),
  ]

  return {
    plugins,
    devServer,
    context: src,
    entry: './index.tsx',
    devtool: 'source-map',
    output: {
      publicPath: '/',
    },
    module: {
      rules: [
        {
          test: /\.ts(x?)$/,
          loader: 'babel-loader',
          include: [src],
          exclude: /node_modules/,
          options: {
            plugins: !isDevelopment ? [] : ['react-refresh/babel'],
          },
        },
        {
          test: /\.s[ac]ss$/,
          use: [
            'style-loader',
            {
              loader: 'css-loader',
              options: {
                modules: {
                  localIdentName: '[local]--[contenthash:base64:5]',
                  exportLocalsConvention: 'camelCaseOnly',
                },
              },
            },
            'sass-loader',
          ],
        },
        {
          test: /\.ttf$/,
          type: 'asset/resource',
        },
      ],
    },
    resolve: {
      alias: { '@app': src },
      extensions: ['.js', '.ts', '.tsx'],
    },
  }
}
