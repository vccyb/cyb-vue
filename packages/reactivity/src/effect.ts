import { extend } from "@cyb-vue/shared";

/**
 * 存储副作用函数的结构
 * target - map
 *          key - set
 *                 [fn1, fn2, ...]
 */
const targetMap = new WeakMap();

/**
 * @description 收集依赖
 * @param target 对象
 * @param key 对象属性值
 */
function track(target, key) {
  let depsMap = targetMap.get(target);
  if (!depsMap) {
    targetMap.set(target, (depsMap = new Map()));
  }
  let dep = depsMap.get(key);
  if (!dep) {
    depsMap.set(key, (dep = new Set()));
  }
  // 对象不存在时候不需要收集依赖 -- 不是副作用函数
  if (!activeEffect) return;
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
  for (const effect of dep) {
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
let activeEffect: ReactiveEffect | undefined;

class ReactiveEffect {
  public deps: any[] = [];
  public _fn: any;
  public scheduler?: any;
  private active: boolean = true;
  public onStop?: () => void;
  constructor(fn, scheduler) {
    this._fn = fn;
    this.scheduler = scheduler;
  }

  run() {
    activeEffect = this;
    return this._fn();
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

export { effect, stop, track, trigger };
