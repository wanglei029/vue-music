/*
 * @Author: your name
 * @Date: 2020-06-04 11:44:49
 * @LastEditTime: 2020-06-08 01:50:20
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \vue-music\src\router\index.js
 */ 
import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from 'views/home/Home'

Vue.use(VueRouter)

  const routes = [
  // {
  //   path: '/',
  //   name: 'Home',
  //   component: Home
  // },
  {
    path: '/',
    redirect:'/recommend'
  },
  {
    path: '/recommend',
    name: 'Recommend',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import( '../views/recommend')
  },
  {
    path: '/rank',
    name: 'Rank',
    component: () => import( '../views/rank')
  },
  {
    path: '/search',
    name: 'Search',
    component: () => import( '../views/search')
  },
  {
    path: '/singer',
    name: 'Singer',
    component: () => import( '../views/singer'),
    children:[
      {
        /* :id 表示的是以id为变量这样一个东西 我们可以传入不同的id值
            这样我们可以跳到不同的子路由 去渲染不同的歌手详情页
        */
        path:':id',
        component:()=>import('components/singer-detail/singer-detail')
      }
    ]
  },
  // {
  //   path: '/',
  //   name: '',
  //   component: () => import( '../views/')
  // },
]

const router = new VueRouter({
  routes
})

export default router
