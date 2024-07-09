"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
function createVNode(type, props, children) {
  const vnode = {
    type,
    props,
    children
  };
  return vnode;
}
function h(type, props, children) {
  return createVNode(type, props, children);
}
const isObject = (value) => {
  return value !== null && typeof value === "object";
};
function createComponentInstance(vnode) {
  const componentInstance = {
    vnode,
    type: vnode.type
  };
  return componentInstance;
}
function render(vnode, container) {
  patch(vnode, container);
}
function patch(vnode, container) {
  const { type } = vnode;
  if (typeof type === "string") {
    processElement(vnode, container);
  } else if (isObject(type)) {
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
  const { children } = vnode;
  el.textContent = children;
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
function setupComponent(instance) {
  setupStatefulComponent(instance);
}
function setupStatefulComponent(instance) {
  const Component = instance.type;
  const { setup } = Component;
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
  const subTree = instance.render();
  patch(subTree, container);
}
function createApp(rootComponent) {
  return {
    mount(rootContainer) {
      const vnode = createVNode(rootComponent);
      render(vnode, rootContainer);
    }
  };
}
exports.createApp = createApp;
exports.h = h;
