import { h } from "../../dist/cyb-vue.es.js";

import { Foo } from "./Foo.js";
export const App = {
  render() {
    // 返回虚拟节点
    const onAdd = (a, b) => {
      console.log("onAdd", a, b);
    };
    const onAddValue = () => {
      console.log("onAddValue");
    };
    return h("div", {}, [h(Foo, { onAdd, onAddValue })]);
  },
  setup() {
    return {};
  },
};
