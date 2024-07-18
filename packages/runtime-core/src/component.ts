import { emit } from "./componentEmit";
function createComponentInstance(vnode) {
  const componentInstance = {
    vnode,
    type: vnode.type,
    setupState: {},
    props: {},
    emit: () => {},
  };

  componentInstance.emit = emit as any;
  return componentInstance;
}

export { createComponentInstance };
