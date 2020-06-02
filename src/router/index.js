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
    component: () => import( '../views/singer')
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
