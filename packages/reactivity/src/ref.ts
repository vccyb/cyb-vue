import { hasChanged, isObject } from "@cyb-vue/shared";
import { isTracking, trackEffects, triggerEffects } from "./effect";
import { reactive } from "./reactive";

class RefImpl {
  private _value: any;
  private _rawValue: any;
  public dep;
  constructor(value: any) {
    // 对象类型需要转化为reactive并且嵌套
    this._rawValue = value;
    this._value = isObject(value) ? reactive(value) : value;
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

export { ref };
