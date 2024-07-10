import { h } from "../../dist/cyb-vue.es.js";

export const App = {
  render() {
    // 返回虚拟节点
    return h(
      "div",
      {
        class: ["cyan", "success"],
      },
      // "hi" + this.msg
      [
        h("p", { class: "cyan" }, "hi "),
        h("p", { class: "darkcyan" }, "plasticine "),
        h("p", { class: "darkviolet" }, "mini-vue!"),
      ]
    );
  },
  setup() {
    return {
      msg: "chen-chen-chen",
    };
  },
};
