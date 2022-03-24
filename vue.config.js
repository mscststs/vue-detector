const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  publicPath:"",
  transpileDependencies: true,
  css:{
    extract: false
  },
  runtimeCompiler:false,
})
