var path = require('path')
var utils = require('./utils')

var projectRoot = path.resolve(__dirname, '../')
const vuxLoader = require('vux-loader')

var config = require('../config')
var vueLoaderConfig = require('./vue-loader.conf')

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

var webpackConfig = {
  entry: {
    app: './src/app/app.js',
    firm: './src/firm/firm.js',
    driver: './src/driver/driver.js'
  },
  output: {
    path: config.build.assetsRoot,
    filename: '[name].js',
    publicPath: process.env.NODE_ENV === 'production'
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    modules: [
      resolve('src'),
      resolve('node_modules')
    ],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': resolve('src'),
      'static': resolve('static'),
      'assets': resolve('src/assets'),
      'appComponents': resolve('src/app/components'),
      'appViews': resolve('src/app/views'),
      'components': resolve('src/components'),
      'directives': resolve('src/directives'),
      'mixins': resolve('src/mixins'),
      'utils': resolve('src/utils'),
      'interface': resolve('src/interface'),
    }
  },
  module: {
    rules: [
      // {
      //   test: /\.(js|vue)$/,
      //   loader: 'eslint-loader',
      //   enforce: 'pre',
      //   include: [resolve('src'), resolve('test')],
      //   options: {
      //     formatter: require('eslint-friendly-formatter')
      //   }
      // },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
      {
        test: /\.js$/,
        loader: 'babel-loader?cacheDirectory=true',
        include: [resolve('src'), resolve('test')]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  }
}


module.exports = vuxLoader.merge(webpackConfig, {
  plugins: [
      {
        name: 'vux-ui'
      },
      {
        name: 'progress-bar'
      },
      {
        name: 'duplicate-style'
      },
      // {
      //   name: 'less-theme',
      //   path: 'src/styles/theme.less'
      // },
      {
        name: 'after-less-parser',
        fn: function (source) {
          if  (this.resourcePath.replace(/\\/g, '/').indexOf('/vux/src/components') > -1) {
            source = source.replace(/px(?!.less)/gi, 'PX')
          }
          return source
        }
      },
      {
        name: 'style-parser',
        fn: function (source) {
          if (this.resourcePath.replace(/\\/g, '/').indexOf('/vux/src/components') > -1) {
            source = source.replace(/px(?!.less)/gi, 'PX')
          }
          return source
        }
      }
    ]
})
