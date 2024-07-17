import { h } from "../../dist/cyb-vue.es.js";

import { Foo } from "./Foo.js";
window.self = null;
export const App = {
  render() {
    window.self = this;
    // 返回虚拟节点
    return h(
      "div",
      {
        class: ["cyan", "success"],
        onClick() {
          console.log("click....");
        },
        // onMouseMove(e) {
        //   console.log("mouse moving...", e);
        // },
      },
      // "hi" + this.msg
      [
        h("p", { class: "cyan" }, "hi "),
        h("p", { class: "darkcyan" }, "plasticine "),
        h("p", { class: "darkviolet" }, `${this.msg}`),
        h(Foo, { count: 666 }),
      ]
    );
  },
  setup() {
    return {
      msg: "chen-chen-chen",
    };
  },
};
