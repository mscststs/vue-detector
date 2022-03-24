<template>
  <div class="detector" v-drag :id="id" ref="detector">
    <div class="d-header" v-drag.anchor>
      <div class="d-left">
        <el-button
          class="d-head-icon"
          icon="el-icon-close"
          size="mini"
          circle
          alt="close"
          type="danger"
          @click="close"
          v-drag.ignore
        ></el-button>
      </div>
      <div class="d-title">
        Vue 探针 ( v{{ version }} ) - 探测到 {{ rootComponents.length }} 个 Vue 模块
      </div>
      <div class="d-right"></div>
    </div>

    <!-- 内容部分 -->
    <div class="d-content">
      <!-- 顶部 工具 -->
      <div class="d-tools">
        <el-input
          v-model="searchVal"
          size="mini"
          placeholder="搜索属性或者元素"
        ></el-input>
        <el-button size="mini" type="primary">搜索</el-button>
        <el-button
          icon="el-icon-refresh"
          size="mini"
          circle
          title="刷新"
          alt="刷新"
          type="warning"
          @click="refresh()"
        ></el-button>
        <el-button
          icon="el-icon-aim"
          size="mini"
          circle
          title="智能过滤"
          alt="智能过滤"
          :type="autoFilter ? 'primary' : 'default'"
          @click="
            () => {
              autoFilter = !autoFilter;
              this.refresh();
            }
          "
        ></el-button>
      </div>

      <div class="d-vline"></div>
      <!-- 中部组件树 -->

      <div class="d-main">
        <div class="d-components">
          <el-tree
            ref="tree"
            :data="rootComponents"
            node-key="_uid"
            :props="vueInstanceProps"
            default-expand-all
            :expand-on-click-node="false"
            empty-text="Anonymous"
            @node-click="showNode"
          >
          </el-tree>
        </div>
        <div class="d-hline"></div>
        <div class="d-details">
          <template v-if="inspectComponent">
            <div class="d-info">DOM: {{ inspectComponent.$el }}</div>
            <div class="d-info">
              data:
              <pre>{{ JSON.stringify(inspectComponent.$data, null, 2) }}</pre>
            </div>
            <div class="d-info" v-if="inspectComponent.$options.methods">
              methods:
              <div class="d-methods-list">
                <div
                  class="d-methods-item"
                  v-for="(method, key) in inspectComponent.$options.methods"
                  :key="key"
                >
                  <span class="d-methods-item-name" :title="method">{{ key }}</span>
                  <span class="d-methods-item-desc">{{ method.length }}</span>
                  <span class="d-methods-item-call">
                    <el-button
                      type="primary"
                      size="mini"
                      v-if="method.length == 0"
                      @click="callMethod(inspectComponent, key)"
                      >调用</el-button
                    >
                  </span>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
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
  props: ["options"],
  data() {
    return {
      id: "detector-" + Math.random().toString(36).substr(2, 9),
      version: packInfo.version,

      searchVal: "",
      autoFilter: true, // 智能过滤

      rootComponents: [],
      vueInstanceProps: {
        label: (data) => {
          return (
            `[${data.$options.name || ""}] <${data.$options._componentTag || ""}>` ||
            `${data.$options.el}` ||
            "Anonymous"
          );
        },
        children: "$children",
      },
      inspectComponent: null,
    };
  },
  mounted() {
    this.fetchRootComponents(); // 获取根组件
  },
  methods: {
    fetchRootComponents() {
      this.rootComponents = [];
      let components = document.querySelectorAll("*");
      components = [...components]
        .filter((comp) => comp.__vue__)
        .map((comp) => comp.__vue__);
      // 遍历结构，找到根节点，移除 Detector 的根节点
      const rootComponents = this.filterChildren(components)
        .filter((comp) => comp.$el !== this.$el)
        .filter((comp) => {
          if (this.autoFilter) {
            if (comp.$options.name === "transition") {
              return false;
            }
          }
          return true;
        });

      // 页面上的 Vue 组件树的所有根节点
      this.rootComponents = rootComponents;
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
    callMethod(comp, key) {
      console.log(comp[key]());
    },
    showNode(data) {
      console.log(data);
      this.inspectComponent = data;
    },
    refresh() {
      this.fetchRootComponents();
    },
    close() {
      this.$el.remove();
      if (this.options.mode === "dev") {
        this.options.reload && this.options.reload();
      }
    },
  },
};
</script>

<style lang="less" scoped>
.detector {
  z-index: 999999;
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
  .d-header {
    height: 30px;
    width: 100%;
    flex: none;
    background-color: #3f3f3f;
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    user-select: none;
    .d-title {
      flex: auto;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .d-left,
    .d-right {
      width: 100px;
      & .d-head-icon {
        transform: scale(0.4);
        font-weight: bold;
        font-size: 1.4em;
        color: transparent;
        &:hover {
          color: white;
        }
      }
    }
    &:hover {
      cursor: grab;
    }
    // &:active {
    //   background-color: #727272;
    //   & + div {
    //     opacity: 0.7;
    //   }
    // }
  }
  .d-content {
    flex: auto;
    width: 100%;
    background-color: white;
    transition: opacity 0.05s;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    overflow: hidden;
    .d-tools {
      padding: 5px;
      flex: none;
      display: flex;
    }
    .d-main {
      display: flex;
      flex: auto;
      width: 100%;
      flex-direction: row;
      padding: 3px;
      overflow: hidden;
      .d-components {
        flex: 1;
        color: #3f3f3f;
        overflow: auto;
      }
      .d-details {
        flex: 1;
        overflow: auto;
        padding: 5px;
        .d-info {
          .d-methods-list {
            padding: 7px 0;
            .d-methods-item {
              width: 100%;
              display: flex;
              padding: 0 15px;
              height: 30px;
              .d-methods-item-name {
                font-weight: bold;
                display: inline-block;
                flex: 1;
              }
              .d-methods-item-desc {
                color: #3f3f3f;
                display: inline-block;
                flex: 1;
              }
              .d-methods-item-call {
                display: inline-block;
                flex: 1;
              }
            }
          }
        }
      }
    }
  }
  .d-vline {
    width: 100%;
    height: 0.5px;
    background-color: #3f3f3f;
    flex: none;
  }
  .d-hline {
    width: 0.5px;
    height: 100%;
    background-color: #3f3f3f;
    flex: none;
    word-break: break-all;
  }
}
</style>

<style lang="less">
.el-tree-node.is-current > .el-tree-node__content {
  color: #0052d9;
  font-weight: bold;
}
</style>
