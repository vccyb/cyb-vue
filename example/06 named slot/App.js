import { h } from "../../dist/cyb-vue.es.js";

import { Foo } from "./Foo.js";
export const App = {
  render() {
    const foo = h(
      Foo,
      {},
      {
        header: h("p", {}, "header"),
        footer: h("p", {}, "footer"),
      }
    );
    return h("div", {}, [foo]);
  },
  setup() {
    return {};
  },
};
