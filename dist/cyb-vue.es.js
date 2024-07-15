var ShapeFlags = /* @__PURE__ */ ((ShapeFlags2) => {
  ShapeFlags2[ShapeFlags2["ELEMENT"] = 1] = "ELEMENT";
  ShapeFlags2[ShapeFlags2["STATEFUL_COMPONENT"] = 2] = "STATEFUL_COMPONENT";
  ShapeFlags2[ShapeFlags2["TEXT_CHILDREN"] = 4] = "TEXT_CHILDREN";
  ShapeFlags2[ShapeFlags2["ARRAY_CHILDREN"] = 8] = "ARRAY_CHILDREN";
  return ShapeFlags2;
})(ShapeFlags || {});
function createVNode(type, props, children) {
  const vnode = {
    type,
    props,
    children,
    shapeFlag: getShapeFlag(type),
    el: null
  };
  if (typeof children === "string") {
    vnode.shapeFlag |= ShapeFlags.TEXT_CHILDREN;
  } else if (Array.isArray(children)) {
    vnode.shapeFlag |= ShapeFlags.ARRAY_CHILDREN;
  }
  return vnode;
}
function getShapeFlag(type) {
  return typeof type === "string" ? ShapeFlags.ELEMENT : ShapeFlags.STATEFUL_COMPONENT;
}
function h(type, props, children) {
  return createVNode(type, props, children);
}
function createComponentInstance(vnode) {
  const componentInstance = {
    vnode,
    type: vnode.type
  };
  return componentInstance;
}
const publicPropertiesMap = {
  $el: (i) => i.vnode.el
};
const PublicInstanceProxyHandlers = {
  get({ _: instance }, key) {
    const { setupState, vnode } = instance;
    const publicGetter = publicPropertiesMap[key];
    if (publicGetter) {
      return publicGetter(instance);
    }
    if (key in setupState) {
      return setupState[key];
    }
  }
};
function render(vnode, container) {
  patch(vnode, container);
}
function patch(vnode, container) {
  const { type, shapeFlag } = vnode;
  if (shapeFlag & ShapeFlags.ELEMENT) {
    processElement(vnode, container);
  } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
    processComponent(vnode, container);
  }
}
function processElement(vnode, container) {
  mountElement(vnode, container);
}
function processComponent(vnode, container) {
  mountComponent(vnode, container);
}
function mountElement(vnode, container) {
  const el = document.createElement(vnode.type);
  vnode.el = el;
  const { children, shapeFlag } = vnode;
  if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
    el.textContent = children;
  } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
    mountChildren(children, el);
  }
  const { props } = vnode;
  for (const [key, value] of Object.entries(props)) {
    el.setAttribute(key, value);
  }
  container.append(el);
}
function mountComponent(vnode, container) {
  const instance = createComponentInstance(vnode);
  setupComponent(instance);
  setupRenderEffect(instance, container);
}
function mountChildren(children, container) {
  children.forEach((v) => {
    patch(v, container);
  });
}
function setupComponent(instance) {
  setupStatefulComponent(instance);
}
function setupStatefulComponent(instance) {
  const Component = instance.type;
  const { setup } = Component;
  instance.proxy = new Proxy({ _: instance }, PublicInstanceProxyHandlers);
  if (setup) {
    const setupResult = setup();
    handleSetupResult(instance, setupResult);
  }
}
function handleSetupResult(instance, setupResult) {
  if (typeof setupResult === "object") {
    instance.setupState = setupResult;
  }
  finishComponentSetup(instance);
}
function finishComponentSetup(instance) {
  const Component = instance.type;
  instance.render = Component.render;
}
function setupRenderEffect(instance, container) {
  const { proxy, vnode } = instance;
  const subTree = instance.render.call(proxy);
  patch(subTree, container);
  vnode.el = subTree.el;
}
function createApp(rootComponent) {
  return {
    mount(rootContainer) {
      const vnode = createVNode(rootComponent);
      render(vnode, rootContainer);
    }
  };
}
export {
  createApp,
  h
};
