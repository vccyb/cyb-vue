function createComponentInstance(vnode) {
  const componentInstance = {
    vnode,
    type: vnode.type,
  };
  return componentInstance;
}

export { createComponentInstance };
