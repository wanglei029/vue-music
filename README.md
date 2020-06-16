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

### vuex 管理歌单对象

``` 
1.先在state中定义歌单对象
      /* 定义歌单对象 */
    disc:{}
2.添加mutation-types
  export const SET_DISC='SET_DISC'
3.在mutation中创建更改函数
    [types.SET_DISC](state,disc){
        state.disc=disc
    }
4.在getters中export出disc
  export const disc = state => state.disc
5.在recommend组建中 跳转是 设置state
    import { mapMutations } from "vuex";
    在methods中扩展mutation
    methods:{
        ...mapMutations({
        setDisc: "SET_DISC"
      })
    },
      selectItem(item) {
      this.$router.push({
        path: `/recommend/${item.dissid}` 
      });
      this.setDisc(item);
    },

6.在disc.vue中接收数据
  import { mapGetters } from "vuex";

  computed: {
    ...mapGetters([
      "disc" //对应的是store/getters 中的disc
    ])
  },
```

### rank组件的调用顺序

``` 
  rank.vue > top-list.vue > music-list.vue > song-list.vue
```

### 搜索历史记录 vuex数据

``` 
定义state
    /* 搜索的历史记录 */
    searchHistory:[]

mutationtypes
    /* mutation 的名字 要修改数组 searchHistory:[] */
    export const SET_SEARCH_HISTORY='SET_SEARCH_HISTORY'

设置mutations
    [types.SET_SEARCH_HISTORY](state,history){
        state.searchHistory=history
    }

设置取值操作getters
    export const searchHistory = state => state.searchHistory

设么时候去写searchHistory
    在suggest.vue中选择列表点击列表项 触发写操作 当某个元素被点击会调用selectItem(item)
    <ul class="suggest-list">
      <li @click="selectItem(item)" class="suggest-item" v-for="item in result">

    selectItem(item) {
      /* 派发事件
        我们不能在这个函数中写 保存歌曲历史的相关逻辑
        因为 suggest组件本身做的事情是不包括去存取歌曲历史的 应该是外面做的事情
        所以这个组件在作为自己要做的事情之后 就可以派发一个事件出去 
        只有关心这个事件的组件 才会去处理 保存搜索历史 这样一个逻辑
        这个逻辑是交由父组件它的外层组件去完成的
        search组件可以监听 select事件
      */
      this.$emit("select", item);
    },

    在search组件中监听 子组件suggest派发的事件select
      <suggest @select="saveSearch" @listScroll="blurInput" :query="query"></suggest>
      /* 保存搜索结果 */
      saveSearch(){

       },

定义action操作
    /* 将搜索历史保存到localStorage中 */
    export const saveSearchHistory = function({commit},query){
        
    }

```
