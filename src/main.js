import Vue from 'vue'
import App from './App.vue'
import Detector from "./detector/index.js"

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')

setTimeout(() => {new Detector();}, 1000);
