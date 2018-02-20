// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuetify from 'vuetify'
import App from './App'
import { store } from './store'
import router from './router'
import ('../node_modules/vuetify/dist/vuetify.min.css')
import App2 from './App2'

Vue.use(Vuetify, {
  theme: {
    primary: '#0091EA',
    secondary: '#424242',
    accent: '#004D40',
    error: '#FF5252',
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#FFC107'
  }
})
Vue.config.productionTip = false

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.forVisitor)) {

    if (localStorage.getItem('Token')) {
      next({
        path: '/'
      })
    } else {
      next()
    }
  } else if (to.matched.some(record => record.meta.forAdmin)) {
    if (localStorage.getItem('forAdmin')) {
      next()
    } else {
      next({
        path: '/'
      })
    }
  } else {
    next()
  }
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
