import { extend } from "@cyb-vue/shared";

/**
 * 存储副作用函数的结构
 * target - map
 *          key - set
 *                 [fn1, fn2, ...]
 */
const targetMap = new WeakMap();

let shouldTrack: boolean = false;

/**
 * @description 当前副作用函数effect对象是否处于track状态
 * @returns {boolean}
 */
function isTracking() {
  return shouldTrack && activeEffect !== undefined;
}

/**
 * @description 收集依赖
 * @param target 对象
 * @param key 对象属性值
 */
function track(target, key) {
  if (!isTracking()) return;
  let depsMap = targetMap.get(target);
  if (!depsMap) {
    targetMap.set(target, (depsMap = new Map()));
  }
  let dep = depsMap.get(key);
  if (!dep) {
    depsMap.set(key, (dep = new Set()));
  }
  trackEffects(dep);
}

/**
 *
 * @description 收集依赖 - 将当前激活的副作用函数加入到dep中
 * @param dep
 */
function trackEffects(dep) {
  if (dep.has(activeEffect)) return;
  dep.add(activeEffect);
  activeEffect.deps.push(dep);
}

/**
 * @description 触发依赖
 * @param target 对象
 * @param key 对象的属性值
 */
function trigger(target, key) {
  const depsMap = targetMap.get(target);
  let dep = depsMap.get(key);
  triggerEffects(dep);
}

/**
 * @description 触发依赖 - 触发依赖
 * @param dep
 */
function triggerEffects(dep) {
  const effects = new Set<any>();
  //如果trigger触发执行的副作用函数与当前正在执行的副作用函数相同，则不触发执行
  dep &&
    dep.forEach((effect) => {
      if (effect !== activeEffect) {
        effects.add(effect);
      }
    });

  for (const effect of effects) {
    if (effect.scheduler) {
      effect.scheduler(effect._fn);
    } else {
      effect.run();
    }
  }
}

/**
 * 当前激活的副作用函数
 */
let activeEffect;
const effectStack: any = [];

class ReactiveEffect {
  public deps: any[] = [];
  public _fn: any;
  public scheduler?: any;
  private active: boolean = true;
  public onStop?: () => void;
  constructor(fn, scheduler?) {
    this._fn = fn;
    this.scheduler = scheduler;
  }

  run() {
    if (!this.active) {
      // 执行完stop之后，说明是手动runner执行
      this._fn();
    }

    if (!effectStack.includes(this)) {
      let lastShouldTrack = shouldTrack;
      // 清空依赖
      cleanupEffect(this);
      try {
        shouldTrack = true; // 打开track的开关
        effectStack.push(this);
        activeEffect = this;
        const result = this._fn();
        shouldTrack = false; // 关闭track的开关
        return result;
      } finally {
        effectStack.pop();
        shouldTrack = lastShouldTrack;
        activeEffect = effectStack[effectStack.length - 1];
      }
    }
  }

  stop() {
    if (this.active) {
      cleanupEffect(this);
      if (this.onStop) {
        this.onStop();
      }
      this.active = false;
    }
  }
}

/**
 * @description 清理依赖，清理所用响应式对象对改effect的依赖
 * @param effect effect实例
 */
function cleanupEffect(effect) {
  effect.deps.forEach((dep) => {
    dep.delete(effect);
  });

  // effect自己的反向存储的依赖,也要清理掉
  effect.deps.length = 0;
}

/**
 * @description 注册副作用函数
 * @param fn 需要注册的副作用函数
 */
function effect(fn, options: any = {}) {
  const _effect = new ReactiveEffect(fn, options.scheduler);
  // _effect.onStop = options.onStop;

  extend(_effect, options);

  _effect.run();

  // 返回一个runner, runner 要关联上effect实例
  const runner: any = _effect.run.bind(_effect);
  runner.effect = _effect;
  return runner;
}

function stop(runner) {
  runner.effect.stop();
}

export {
  ReactiveEffect,
  effect,
  stop,
  track,
  trigger,
  trackEffects,
  triggerEffects,
  isTracking,
};
