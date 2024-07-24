import { h } from "../../dist/cyb-vue.es.js";

import { Foo } from "./Foo.js";
export const App = {
  render() {
    const foo = h(
      Foo,
      {},
      {
        header: ({ age }) => h("p", {}, "header" + age),
        footer: ({ age, footerData }) =>
          h("p", {}, "footer" + age + footerData),
      }
    );
    return h("div", {}, [foo]);
  },
  setup() {
    return {};
  },
};
