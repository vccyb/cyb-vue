import { ReactiveEffect } from "./effect";

class ComputedRefImpl {
  private _getter: any;
  // 控制是否需要重新计算
  private _dirty: boolean = true;
  private _value: any;
  private _effect: ReactiveEffect;
  constructor(getter) {
    this._getter = getter;
    // lazy，首次不能执行，所以使用的new
    this._effect = new ReactiveEffect(getter);
    this._effect.scheduler = () => {
      if (!this._dirty) {
        this._dirty = true;
      }
    };
  }

  get value() {
    // 首次就是计算一次
    if (this._dirty) {
      this._value = this._effect.run();
      // 计算完之后，将_dirty设置为false，下次再获取的时候，直接使用缓存值
      this._dirty = false;
    }
    // 否则使用缓存值
    return this._value;
  }
}

function computed(getter) {
  return new ComputedRefImpl(getter);
}

export { computed };
