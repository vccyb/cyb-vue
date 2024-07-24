import { h, renderSlots } from "../../dist/cyb-vue.es.js";

export const Foo = {
  setup(props, { emit }) {},

  render() {
    // console.log(this.$slots);
    // const foo = h("p", {}, "foo");
    // return h("div", {}, [foo, renderSlots(this.$slots)]);

    const foo = h("p", {}, "foo");
    const age = 20;
    const footerData = 9999;
    const vnode = h("div", {}, [
      renderSlots(this.$slots, "header", { age }),
      foo,
      renderSlots(this.$slots, "footer", { age, footerData }),
    ]);
    return vnode;
  },
};
