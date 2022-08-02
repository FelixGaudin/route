import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Shop from '../views/Shop.vue'
import Admin from '../views/Admin.vue'

Vue.use(VueRouter)


const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path : '/shop/:user',
    name : 'Shop',
    component : Shop
  },
  {
    path: '/admin',
    name: 'Admin',
    component: Admin
  }
]

const router = new VueRouter({
  routes,
  // mode : process.env.IS_ELECTRON ? 'hash' : 'history',
})

export default router
