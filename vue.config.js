const webpack = require('webpack');
// eslint-disable-line import/no-extraneous-dependencies
const protocol = process.env.HTTPS === 'true' ? 'https' : 'http';
// const path = require('path');

module.exports = {
  css: {
    loaderOptions: {
      sass: {
        data: '@import "@/global.scss";',
      },
    },
  },
  configureWebpack: {
    module: {
      rules: [
        {
          test: /\.html$/,
          use: 'raw-loader',
        },
        // {
        // 不知道vue3.0做什么妖转的base64页面加载不出来
        //   test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        //   loader: 'url-loader',
        //   options: {
        //     limit: 1000,
        //   }
        // },
      ],
    },
  },
  chainWebpack: (config) => {

  },
  pluginOptions: {
    webpackBundleAnalyzer: {
      openAnalyzer: false,
    },
  },
  devServer: {
    host: '0.0.0.0',
    port: 8080,
    https: false
  },
};
