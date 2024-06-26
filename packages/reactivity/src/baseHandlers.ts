import { extend, isObject } from "@cyb-vue/shared";
import { track, trigger } from "./effect";
import { ReactiveFlags, reactive, readonly, shallowReadonly } from "./reactive";

const get = createGetter();
const set = createSetter();
const readonlyGet = createGetter(true);
const shallowReadonlyGet = createGetter(true, true);

function createGetter(isReadonly = false, shallow = false) {
  return function get(target, key) {
    const res = Reflect.get(target, key);

    // 如果读取的key上 is_reactive 则返回true，
    // 这个key专门为isReactive 服务
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

    // 递归处理res
    if (isObject(res)) {
      return isReadonly ? readonly(res) : reactive(res);
    }

    if (!isReadonly) {
      // 收集依赖
      track(target, key);
    }
    return res;
  };
}

function createSetter() {
  return function set(target, key, value) {
    const res = Reflect.set(target, key, value);
    trigger(target, key);
    return res;
  };
}

const mutableHandlers = {
  get,
  set,
};

const readonlyHandlers = {
  get: readonlyGet,
  set(target, key, value) {
    console.warn(
      `key: ${key} set value: ${value} failed, because the target is readonly!`,
      target
    );
    return true;
  },
};

const shallowReadonlyHandlers = extend({}, readonlyHandlers, {
  get: shallowReadonlyGet,
});

export { mutableHandlers, readonlyHandlers, shallowReadonlyHandlers };
