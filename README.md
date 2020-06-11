<!--
 * @Author: your name
 * @Date: 2020-05-15 05:12:43
 * @LastEditTime: 2020-06-10 23:59:19
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \vue-music\README.md
--> 
## 配置服务器
```
  因为http请求的默认端口为80端口
  服务器上已经安装了appache服务器 且默认端口是80 
  所以当 y.aishangvip.com发起请求是默认访问的是80端口

  但是服务器同时安装了nginx服务器 端口是8080
  我们想要的的是  y.aishangvip.com发起请求时访问的是nginx
  而不是通过  y.aishangvip.com:8080 来访问nginx
  实际项目中 服务器一般只会对外暴露80端口 
  所以我们在不带端口号的情况下去访问nginx 需要通过 appache 来代理请求访问服务器内部端口
  需要先配置httpd.conf 文件
  LoadModule  proxy_module         modules/mod_proxy.so #具体路径按照安装路径来定
  LoadModule  proxy_http_module    modules/mod_proxy_http.so
  LoadModule  headers_module       modules/mod_headers.so
  以上三个模块需要解开注释
  配置域名
  <VirtualHost *:80>
    ServerName y.aishangvip.com
    ProxyPreserveHost On
    ProxyRequests Off

    ProxyPass / http://localhost:8080/
    ProxyPassReverse / http://localhost:8080/

    ErrorLog logs/y.aishangvip.com_error_log
    CustomLog logs/y.aishangvip.com_access_log common
</VirtualHost>

重启appache 服务器  service httpd restart

配置nginx.conf文件
    server {
        listen       8080 default_server;
        listen       [::]:8080 default_server;
        server_name  y.aishangvip.com;
        root         /usr/share/nginx/html;

        # Load configuration files for the default server block.
        include /etc/nginx/default.d/*.conf;

        location / {
            root /alidata/www/yinyue;
            index index.html index.htm
        }

        error_page 404 /404.html;
            location = /40x.html {
        }

        error_page 500 502 503 504 /50x.html;
            location = /50x.html {
        }
    }
```
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
### 创建song类
  common/js/song

###  7-3  播放器vuex的数据流程
```
我们通过定义的vuex以及一些事件的点击操作，去修改了vuex的一些数据，通过这一系列的操作行为，我们就实现了
player组件的显示，这就是vuex的厉害之处

比如说我们现在在歌手的详情页singer-detail.vue 去点击数据，之后会有歌单详情页或者是 排行榜 甚至是搜索结果
当我们点击这个行为的时候(在song-list.vue中 @click="selectItem(song, index)") 我们都会提交action，然后action就会修改我们的state

action通过我们的提交mutation去修改我们的数据，然后我们的数据就映射到player.vue中的数据 player的数据就会映射到他的dom上，
<div class="normal-player" v-show="fullScreen">播放器</div>
比如说修改了fullScreen normal-player这个dom 为true的时候就会显示

```
### 7-4 播放器全屏
```
关闭全屏
<div class="back" @click="back"> 顶部添加点击事件 back

打开全屏
<div class="mini-player" v-show="!fullScreen" @click="open"> 添加点击事件 open

```
### 7-6 js创建CSS3动画 
```
npm i create-keyframe-animation  --save
这个库提供了js编程方式去写css3动画
```