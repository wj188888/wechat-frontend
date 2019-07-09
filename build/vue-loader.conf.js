var utils = require('./utils')
var config = require('../config')
var isProduction = process.env.NODE_ENV === 'production'

module.exports = {
  loaders: utils.cssLoaders({
    sourceMap: isProduction
      ? config.build.productionSourceMap
      : config.dev.cssSourceMap,
    extract: isProduction
  }),
  postcss: [
    require('postcss-pxtorem')({
      rootValue: 20,
      unitPrecision: 5,
      // selectorBlackList:['.inline-calendar'],
      propWhiteList: [],
      replace: true,
      mediaQuery: false,
      minPixelValue: 0
    }),
    require('autoprefixer')
  ]
}
