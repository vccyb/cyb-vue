import { hasOwn } from "@cyb-vue/shared";

const publicPropertiesMap = {
  $el: (i) => i.vnode.el,
};

export const PublicInstanceProxyHandlers = {
  get({ _: instance }, key) {
    const { setupState, vnode, props } = instance;
    // if (key === "$el") {
    //   return vnode.el;
    // }
    const publicGetter = publicPropertiesMap[key];
    if (publicGetter) {
      return publicGetter(instance);
    }
    if (hasOwn(setupState, key)) {
      return setupState[key];
    } else if (hasOwn(props, key)) {
      return props[key];
    }
  },
};
