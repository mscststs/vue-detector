# A Vue Detector

## About  

**这是一个什么项目？**  
该项目用于探测目标页面上的所有 Vue 模块，
用来学习、探索开发者使用的开发方式和页面结构  


## 开发方式

### 本地开发:   
1. `npm run serve`  

### tamperMonkey 开发:   

0. 安装 [开发版加载脚本](https://greasyfork.org/zh-CN/scripts/442012-a-vue-detector-%E5%BC%80%E5%8F%91%E7%89%88)
1. `npm run build`
2. cd dist &&  npx http-server -p 80 --cors -g  

在开发版脚本模式下，关闭 detector 窗口会自动重新加载，相当于刷新代码


