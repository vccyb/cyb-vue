function createComponentInstance(vnode) {
  const componentInstance = {
    vnode,
    type: vnode.type,
    setupState: {},
    props: {},
  };
  return componentInstance;
}

export { createComponentInstance };
