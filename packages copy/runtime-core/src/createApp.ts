import { render } from "./renderer";
import { createVNode } from "./vnode";

function createApp(rootComponent) {
  return {
    mount(rootContainer) {
      // 1. 将rootComponent 转化为虚拟节点，再进行处理
      const vnode = createVNode(rootComponent);

      // 2. 将虚拟节点挂载到容器中
      render(vnode, rootContainer);
    },
  };
}

export { createApp };
