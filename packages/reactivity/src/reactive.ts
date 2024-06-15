import {
  mutableHandlers,
  readonlyHandlers,
  shallowReadonlyHandlers,
} from "./baseHandlers";

const enum ReactiveFlags {
  IS_REACTIVE = "__v_isReactive",
  IS_READONLY = "__v_isReadonly",
}

function createReactiveObject(target, baseHandlers) {
  return new Proxy(target, baseHandlers);
}

/**
 * @description 获取响应式对象
 * @param raw 原始对象
 * @returns 响应式对象
 */
function reactive(raw: object) {
  return createReactiveObject(raw, mutableHandlers);
}

/**
 * @description 获取只读对象
 * @param raw 原始对象
 * @returns 只读对象
 */
function readonly(raw: object) {
  return createReactiveObject(raw, readonlyHandlers);
}

function shallowReadonly(raw: object) {
  return createReactiveObject(raw, shallowReadonlyHandlers);
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
