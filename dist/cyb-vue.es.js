var ShapeFlags = /* @__PURE__ */ ((ShapeFlags2) => {
  ShapeFlags2[ShapeFlags2["ELEMENT"] = 1] = "ELEMENT";
  ShapeFlags2[ShapeFlags2["STATEFUL_COMPONENT"] = 2] = "STATEFUL_COMPONENT";
  ShapeFlags2[ShapeFlags2["TEXT_CHILDREN"] = 4] = "TEXT_CHILDREN";
  ShapeFlags2[ShapeFlags2["ARRAY_CHILDREN"] = 8] = "ARRAY_CHILDREN";
  return ShapeFlags2;
})(ShapeFlags || {});
const isObject = (value) => {
  return value !== null && typeof value === "object";
};
const extend = Object.assign;
const hasOwn = (target, key) => Object.prototype.hasOwnProperty.call(target, key);
const targetMap = /* @__PURE__ */ new WeakMap();
function trigger(target, key) {
  const depsMap = targetMap.get(target);
  let dep = depsMap.get(key);
  triggerEffects(dep);
}
function triggerEffects(dep) {
  const effects = /* @__PURE__ */ new Set();
  dep && dep.forEach((effect2) => {
    if (effect2 !== activeEffect) {
      effects.add(effect2);
    }
  });
  for (const effect2 of effects) {
    if (effect2.scheduler) {
      effect2.scheduler(effect2._fn);
    } else {
      effect2.run();
    }
  }
}
let activeEffect;
const get = createGetter();
const set = createSetter();
const readonlyGet = createGetter(true);
const shallowReadonlyGet = createGetter(true, true);
function createGetter(isReadonly = false, shallow = false) {
  return function get2(target, key) {
    const res = Reflect.get(target, key);
    if (key === ReactiveFlags.IS_REACTIVE) {
      return !isReadonly;
    } else if (key === ReactiveFlags.IS_READONLY) {
      return isReadonly;
    } else if (key === ReactiveFlags.RAW) {
      return target;
    }
    if (shallow) {
      return res;
    }
    if (isObject(res)) {
      return isReadonly ? readonly(res) : reactive(res);
    }
    return res;
  };
}
function createSetter() {
  return function set2(target, key, value) {
    const res = Reflect.set(target, key, value);
    trigger(target, key);
    return res;
  };
}
const mutableHandlers = {
  get,
  set
};
const readonlyHandlers = {
  get: readonlyGet,
  set(target, key, value) {
    console.warn(
      `key: ${key} set value: ${value} failed, because the target is readonly!`,
      target
    );
    return true;
  }
};
const shallowReadonlyHandlers = extend({}, readonlyHandlers, {
  get: shallowReadonlyGet
});
var ReactiveFlags = /* @__PURE__ */ ((ReactiveFlags2) => {
  ReactiveFlags2["IS_REACTIVE"] = "__v_isReactive";
  ReactiveFlags2["IS_READONLY"] = "__v_isReadonly";
  ReactiveFlags2["RAW"] = "__v_raw";
  return ReactiveFlags2;
})(ReactiveFlags || {});
const reactiveMap = /* @__PURE__ */ new WeakMap();
const readonlyMap = /* @__PURE__ */ new WeakMap();
const shallowReadonlyMap = /* @__PURE__ */ new WeakMap();
function createReactiveObject(target, baseHandlers, proxyMap) {
  if (!isObject(target)) {
    console.warn(`target: ${target} must be an object`);
    return target;
  }
  if (target[
    "__v_raw"
    /* RAW */
  ]) {
    return target;
  }
  const existingProxy = proxyMap.get(target);
  if (existingProxy) {
    return existingProxy;
  }
  const proxy = new Proxy(target, baseHandlers);
  proxyMap.set(target, proxy);
  return proxy;
}
function reactive(raw) {
  return createReactiveObject(raw, mutableHandlers, reactiveMap);
}
function readonly(raw) {
  return createReactiveObject(raw, readonlyHandlers, readonlyMap);
}
function shallowReadonly(raw) {
  return createReactiveObject(raw, shallowReadonlyHandlers, shallowReadonlyMap);
}
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
function emit(instance, event, ...args) {
  const { props } = instance;
  console.log("emit", event);
  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);
  const camelize = (str) => {
    return str.replace(/-(\w)/g, (_, s) => {
      return s ? s.toUpperCase() : "";
    });
  };
  const toHandlerKey = (str) => {
    return str ? "on" + capitalize(camelize(str)) : "";
  };
  const hanlderKey = toHandlerKey(event);
  const hanlder = props[hanlderKey];
  hanlder && hanlder(...args);
}
function createComponentInstance(vnode) {
  const componentInstance = {
    vnode,
    type: vnode.type,
    setupState: {},
    props: {},
    emit: () => {
    },
    slots: {}
  };
  componentInstance.emit = emit;
  return componentInstance;
}
const publicPropertiesMap = {
  $el: (i) => i.vnode.el,
  $slots: (i) => i.slots
};
const PublicInstanceProxyHandlers = {
  get({ _: instance }, key) {
    const { setupState, vnode, props } = instance;
    const publicGetter = publicPropertiesMap[key];
    if (publicGetter) {
      return publicGetter(instance);
    }
    if (hasOwn(setupState, key)) {
      return setupState[key];
    } else if (hasOwn(props, key)) {
      return props[key];
    }
  }
};
function initProps(instance, rawProps) {
  instance.props = rawProps ?? {};
}
function initSlots(instance, children) {
  if (children)
    normalizeObjectSlots(children, instance.slots);
}
function normalizeObjectSlots(children, slots) {
  for (const [key, value] of Object.entries(children)) {
    slots[key] = normalizeSlots(value);
  }
}
function normalizeSlots(value) {
  return Array.isArray(value) ? value : [value];
}
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
    const isOn = (key2) => /^on[A-Z]/.test(key2);
    if (isOn(key)) {
      el.addEventListener(key.slice(2).toLocaleLowerCase(), value);
    } else {
      el.setAttribute(key, value);
    }
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
  initProps(instance, instance.vnode.props);
  initSlots(instance, instance.vnode.children);
  setupStatefulComponent(instance);
}
function setupStatefulComponent(instance) {
  const Component = instance.type;
  const { setup } = Component;
  instance.proxy = new Proxy({ _: instance }, PublicInstanceProxyHandlers);
  if (setup) {
    const setupResult = setup(shallowReadonly(instance.props), {
      emit: instance.emit.bind(null, instance)
    });
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
function renderSlots(slots, name) {
  const slot = slots[name];
  if (slot) {
    return createVNode("div", {}, slot);
  }
}
export {
  createApp,
  h,
  renderSlots,
  shallowReadonly
};
