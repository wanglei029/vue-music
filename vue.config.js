module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        'assets': '@/assets',
        'stylus': '@/assets/stylus',
        'components': '@/components',
        'common': '@/common',
        'router': '@/router',
        'views': '@/views',
        'store': '@/store',
        'api': '@/api',
        'base': '@/base'
      }
    }
  },
  devServer: {
    // proxy: {
    //   '/api': {
    //     target: 'http://127.0.0.1:8080',
    //     pathRewrite: {
    //       '^/api': '/mock/'
    //     }
    //   }
    // }
    proxy: {
      '/api/getDiscList': {
        target: 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg',
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/api/getDiscList': ''
        },
        headers: {
          referer: 'https://c.y.qq.com/',
          host: 'c.y.qq.com'
        },
      },
      '/foo': {
        target: '<other_url>'
      }
    }
  }
}