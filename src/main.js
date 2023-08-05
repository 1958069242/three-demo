import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'swiper/dist/css/swiper.css'
import 'swiper/dist/js/swiper.min'
Vue.config.productionTip = false

// import playvr from 'playvr'
// Vue.use(playvr)
import './reset.css'
import './res/rem';
new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')

