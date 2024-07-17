import { h } from "../../dist/cyb-vue.es.js";

export const Foo = {
  setup(props) {
    props.count = 9999;
    console.log(props);
  },
  render() {
    return h("div", {}, `foo ${this.count}`);
  },
};
