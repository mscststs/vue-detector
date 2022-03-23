<template>
  <div class="detector" v-drag :id="id" ref="detector">
    <div class="header" data-anchor>Vue Detector ( v{{ version }} )</div>
    <div class="content"></div>
  </div>
</template>

<script>
import drag from "./directive/drag.js";
import packInfo from "../../package.json";
import { mapVueComponentChildern } from "./utils/index.js";

export default {
  directives: {
    drag,
  },
  data() {
    return {
      id: "detector-" + Math.random().toString(36).substr(2, 9),
      version: packInfo.version,
    };
  },
  mounted() {
    this.fetchRootComponents();
  },
  methods: {
    fetchRootComponents() {
      let components = document.querySelectorAll("*");
      components = [...components]
        .filter((comp) => comp.__vue__)
        .map((comp) => comp.__vue__);
      // 遍历结构，找到根节点，移除 Detector 的根节点
      const rootComponents = this.filterChildren(components).filter(
        (comp) => comp.$el !== this.$el
      );

      // 页面上的 Vue 组件树的所有根节点
      return rootComponents;
    },

    filterChildren(components) {
      for (let index = 0; index < components.length; index++) {
        mapVueComponentChildern(components[index], (child) => {
          //从 components 移除 child
          if (components.indexOf(child) > -1) {
            components.splice(components.indexOf(child), 1);
          }
        });
      }
      return components;
    },
  },
};
</script>

<style lang="less">
.detector {
  width: 800px;
  height: 600px;
  display: flex;
  flex-direction: column;
  position: fixed;
  left: 200px;
  top: 100px;
  box-shadow: 0px 0px 10px #3f3f3f, 0 0 0px 0.5px #3f3f3f;
  overflow: hidden;
  border-radius: 3px;
  .header {
    height: 30px;
    width: 100%;
    flex: none;
    background-color: #3f3f3f;
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    user-select: none;
    &:hover {
      cursor: grab;
    }
    &:active {
      background-color: #727272;
      & + div {
        opacity: 0.7;
      }
    }
  }
  .content {
    flex: auto;
    width: 100%;
    background-color: white;
    transition: opacity 0.05s;
  }
}
</style>
