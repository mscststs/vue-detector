import App from "./App.vue"
import Vue from "vue"

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