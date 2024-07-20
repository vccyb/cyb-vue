import { h } from "../../dist/cyb-vue.es.js";

import { Foo } from "./Foo.js";
export const App = {
  render() {
    const foo = h(Foo, {}, [
      h("p", {}, "default slot"),
      h("p", {}, "default slot 2"),
    ]);
    return h("div", {}, [foo]);
  },
  setup() {
    return {};
  },
};
