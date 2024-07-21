import { h, renderSlots } from "../../dist/cyb-vue.es.js";

export const Foo = {
  setup(props, { emit }) {},

  render() {
    // console.log(this.$slots);
    // const foo = h("p", {}, "foo");
    // return h("div", {}, [foo, renderSlots(this.$slots)]);

    const foo = h("p", {}, "foo");
    const vnode = h("div", {}, [
      renderSlots(this.$slots, "header"),
      foo,
      renderSlots(this.$slots, "footer"),
    ]);
    return vnode;
  },
};
