import App from "./App.vue"
// import Vue from "vue"
import Vue from "vue/dist/vue.runtime.esm.js"
import ElementUI from "element-ui/src/index.js";
import "element-ui/lib/theme-chalk/index.css"
import './assets/style/theme/index.css';

Vue.use(ElementUI);
Vue.config.productionTip = false


export default class Detector {
  constructor(options) {
    this.options =Object.assign({
      mode: "prod", // dev | prod 模式
      reload : null // 重新加载的回调函数
    }, options);

    this.node = document.createElement('div');
    self.document.body.appendChild(this.node);

    this.init()
  }

  init(){
    const options = this.options;
    new Vue({
      render: h => h(App,{
        props: {
          options
        },
      }),
    }).$mount(this.node)
  }
}