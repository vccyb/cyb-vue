import { isObject } from "@cyb-vue/shared";
import { createComponentInstance } from "./component";

/**
 * @description 渲染vnode 到容器上
 * @param vnode 虚拟节点
 * @param container 容器节点
 */
function render(vnode, container) {
  // 调用patch
  patch(vnode, container);
}

/**
 * @description 能够处理 component类型和 dom element类型
 *
 * component 会递归调用patch继续处理
 * element 直接进行渲染
 *
 * @param vnode vnode
 * @param container 容器
 *
 */
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

  // props
  const { props } = vnode;
  for (const [key, value] of Object.entries(props)) {
    el.setAttribute(key, value);
  }

  container.append(el);
}

function mountComponent(vnode, container) {
  // 更具vnode 创建组件实例
  const instance = createComponentInstance(vnode);

  // setup 组件实例
  setupComponent(instance);
  setupRenderEffect(instance, container);
}

function setupComponent(instance) {
  // TODO
  // initProps
  // initSlots

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
  // setup 返回的是一个对象，作为实例的setupState
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

export { render };
