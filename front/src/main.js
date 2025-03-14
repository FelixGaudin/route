import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'


Vue.config.productionTip = false

import Buefy from 'buefy'
import 'buefy/dist/buefy.css'

Vue.use(Buefy)

Vue.prototype.$test = 'Brrr la mif'
Vue.prototype.$axios = axios
Vue.prototype.$backend = "http://localhost:6969"
Vue.prototype.$tresh = 12 * 60 * 60

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
