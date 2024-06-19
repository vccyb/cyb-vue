import { hasChanged, isObject } from "@cyb-vue/shared";
import { isTracking, trackEffects, triggerEffects } from "./effect";
import { reactive } from "./reactive";
import { an } from "vitest/dist/reporters-yx5ZTtEV";

/**
 *
 * @description 对象类型幻化为reactive对象，如果是object
 * @param value 值
 * @returns reactive 对象 或者是他自己
 */
function convert(value) {
  return isObject(value) ? reactive(value) : value;
}

class RefImpl {
  private _value: any;
  private _rawValue: any;
  public dep;
  public __v_isRef = true;
  constructor(value: any) {
    // 对象类型需要转化为reactive并且嵌套
    this._rawValue = value;
    this._value = convert(value);
    this.dep = new Set();
  }

  get value() {
    if (isTracking()) {
      trackEffects(this.dep);
    }
    return this._value;
  }

  set value(newValue) {
    if (hasChanged(newValue, this._rawValue)) {
      this._rawValue = newValue;
      this._value = newValue;
      triggerEffects(this.dep);
    }
  }
}

function ref(value) {
  return new RefImpl(value);
}

/**
 * @description 判断是否是ref对象
 * @param value 任意值
 * @returns {boolean}
 */
function isRef(value: RefImpl | any) {
  return !!value.__v_isRef;
}

/**
 * @description 返回ref对象的value，或者值本身
 * @param value 任意值
 * @returns value
 */
function unRef(value: RefImpl | any) {
  return isRef(value) ? value.value : value;
}

function proxyRefs(objectWithRefs) {
  return new Proxy(objectWithRefs, {
    get(target, key) {
      // 如果是ref属性，.value, 否则原始值 unRef
      return unRef(Reflect.get(target, key));
    },
    set(target, key, newValue) {
      const oldValue = target[key];
      // 如果老的是ref，就需要.value = xxx 新值不是ref
      // ref - obj => 不行，代码里面.value 你得保证
      if (isRef(oldValue) && !isRef(newValue)) {
        oldValue.value = newValue;
        return true;
      } else {
        // old  new
        // ref  ref
        // obj  obj
        // obj  ref
        return Reflect.set(target, key, newValue);
      }
    },
  });
}
export { ref, isRef, unRef, proxyRefs };
