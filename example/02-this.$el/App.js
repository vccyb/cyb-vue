import { h } from "../../dist/cyb-vue.es.js";
window.self = null;
export const App = {
  render() {
    window.self = this;
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
        h("p", { class: "darkviolet" }, `${this.msg}`),
      ]
    );
  },
  setup() {
    return {
      msg: "chen-chen-chen",
    };
  },
};
