import { isObject } from "@cyb-vue/shared";
import {
  mutableHandlers,
  readonlyHandlers,
  shallowReadonlyHandlers,
} from "./baseHandlers";

const enum ReactiveFlags {
  IS_REACTIVE = "__v_isReactive",
  IS_READONLY = "__v_isReadonly",
  RAW = "__v_raw",
}

export const reactiveMap = new WeakMap();
export const readonlyMap = new WeakMap();
export const shallowReadonlyMap = new WeakMap();

function createReactiveObject(target, baseHandlers, proxyMap) {
  if (!isObject(target)) {
    console.warn(`value cannot be made reactive: ${String(target)}`);
    return target;
  }

  if (target[ReactiveFlags.RAW]) {
    return target;
  }

  const existingProxy = proxyMap.get(target);
  // 如果已经代理过了

  // 如果监听过了
  if (existingProxy) {
    return existingProxy;
  }

  const proxy = new Proxy(target, baseHandlers);
  // 缓存
  proxyMap.set(target, proxy);
  return proxy;
}

/**
 * @description 获取响应式对象
 * @param raw 原始对象
 * @returns 响应式对象
 */
function reactive(raw: object) {
  return createReactiveObject(raw, mutableHandlers, reactiveMap);
}

/**
 * @description 获取只读对象
 * @param raw 原始对象
 * @returns 只读对象
 */
function readonly(raw: object) {
  return createReactiveObject(raw, readonlyHandlers, readonlyMap);
}

function shallowReadonly(raw: object) {
  return createReactiveObject(raw, shallowReadonlyHandlers, shallowReadonlyMap);
}

// 判断是否是响应式对象
function isReactive(value) {
  return !!value[ReactiveFlags.IS_REACTIVE];
}

// 判断是否是只读对象
function isReadonly(value) {
  return !!value[ReactiveFlags.IS_READONLY];
}

// 判断是否是代理对象
function isProxy(value) {
  return isReactive(value) || isReadonly(value);
}

export {
  ReactiveFlags,
  reactive,
  readonly,
  isReactive,
  isReadonly,
  isProxy,
  shallowReadonly,
};
