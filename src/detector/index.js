import App from "./App.vue"
// import Vue from "vue"
import Vue from "vue/dist/vue.esm.browser.js"
import ElementUI from "element-ui/src/index.js";
import "element-ui/lib/theme-chalk/index.css"
import './assets/style/theme/index.css';

Vue.use(ElementUI);


export default class Detector {
  constructor() {
    this.node = document.createElement('div');
    self.document.body.appendChild(this.node);

    this.init()
  }

  init(){
    new Vue({
      render: h => h(App,{id:this.id}),
    }).$mount(this.node)
  }
}