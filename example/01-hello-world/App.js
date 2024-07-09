import { h } from "../../dist/cyb-vue.es.js";

export const App = {
  render() {
    // 返回虚拟节点
    return h(
      "div",
      {
        class: ["cyan", "success"],
      },
      "hi" + this.msg
    );
  },
  setup() {
    return {
      msg: "chen-chen-chen",
    };
  },
};
