const fs = require('fs')

// 遍历文件夹下所有js 和vue 文件
function walk(path, callback) {
  let files = fs.readdirSync(path)
  files.forEach(function(file) {
    let states = fs.statSync(path + '/' + file)
    if (states.isDirectory()) {
      walk(path + '/' + file, callback)
    } else {
      if (file.endsWith('.js') || file.endsWith('.vue')) {
        // 修改每一个文件 
        callback(path + '/' + file);
      }
    }
  })
}

function replaceVue(path){
  const commonVue = "import Vue from 'vue';";
  const esmBrowserVue = "import Vue from 'vue/dist/vue.esm.browser.js';";
  const esmRuntimeVue = "import Vue from 'vue/dist/vue.runtime.esm.js';";

  let content = fs.readFileSync(path, 'utf8');
  content = content.replace(commonVue, esmBrowserVue);
  content = content.replace(esmBrowserVue, esmRuntimeVue);
  fs.writeFileSync(path, content);
}

function fixElementUI(){
  console.log("[fix]: 修复 ElementUI 引用问题");
  walk("./node_modules/element-ui/src/",replaceVue)
  walk("./node_modules/element-ui/packages/",replaceVue)
}



fixElementUI();