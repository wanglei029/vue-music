# vue-music

## Project setup

``` 
npm install
```

### Compiles and hot-reloads for development

``` 
npm run serve
```

### Compiles and minifies for production

``` 
npm run build
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).

### api目录放一些和后端请求相关的代码 ajax 或 jsonP请求

### common放通用的静态资源 字体文件 公用图片

### 后端接口代理设置

``` 
1.创建vue.config.js
2.添加配置项 proxy
    proxy: {
      '/api/getDiscList': {
        target: 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg',
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/api/getDiscList': ''
        },
        //设置请求头
        headers: { 
          referer: 'https://c.y.qq.com/',
          host: 'c.y.qq.com'
        },
      },
      '/foo': {
        target: '<other_url>'
      }
    }
3.在recommend.js中发送axios请求
    export function getDiscList() {
    console.log("getDiscList被调用");
    const url = '/api/getDiscList'
    const data = Object.assign({}, commonParams, {
        platform: 'yqq',
        hostUin: 0,
        sin: 0,
        ein: 29,
        sortId: 5,
        needNewCode: 0,
        categoryId: 10000000,
        rnd: Math.random(),
        format: 'json'
    })
    return axios.get(url, {
        params: data
    }).then((res) => {
        return Promise.resolve(res.data)
    })
    }

```
