import Vue from 'vue'
import App from './App.vue'
import router from './router'
// import VueIPC from 'vue_ipc';
// import db from './js/db.js'
// Vue.use(VueIPC);



Vue.config.productionTip = false

import Buefy from 'buefy'
import 'buefy/dist/buefy.css'

Vue.use(Buefy)

// Vue.prototype.$db = db

Vue.prototype.$test = 'Brrr la mif'
// Vue.prototype.$db = db

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
