import { h } from "../../dist/cyb-vue.es.js";

export const Foo = {
  setup(props, { emit }) {
    const emitAdd = () => {
      console.log("emit add");
      emit("add", "123", 5, 6);
      emit("add-value");
    };

    return {
      emitAdd,
    };
  },
  render() {
    return h(
      "button",
      {
        onClick: this.emitAdd,
      },
      "add"
    );
  },
};
