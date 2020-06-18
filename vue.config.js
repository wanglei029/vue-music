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
      '/api/lyric': {
        target: 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg',
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/api/lyric': ''
        },
        headers: {
          referer: 'https://c.y.qq.com/',
          host: 'c.y.qq.com'
        },
      },
      '/api/getMusicVKey': {
        target: 'http://y.aishangvip.com/getMusicVKey',
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/api/getMusicVKey': ''
        },
        headers: {
          referer: 'http://y.aishangvip.com/',
          host: 'y.aishangvip.com'
        },
      },
      '/api/getSearch': {
        target: 'https://c.y.qq.com/soso/fcgi-bin/client_search_cp',
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/api/getSearch': ''
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