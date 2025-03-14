import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Shop from '../views/Shop.vue'
import Admin from '../views/Admin.vue'
import Games from '../views/Games.vue'

Vue.use(VueRouter)


const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path : '/shop/:infos',
    name : 'Shop',
    component : Shop
  },
  {
    path: '/admin',
    name: 'Admin',
    component: Admin
  },
  {
    path: '/games/:infos',
    name : "Games",
    component : Games
  }
]

const router = new VueRouter({
  routes,
  // mode : process.env.IS_ELECTRON ? 'hash' : 'history',
})

export default router
