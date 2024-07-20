export function initSlots(instance, children) {
  // 保证 $slots 一定是存放 vnode 的数组
  instance.slots = Array.isArray(children) ? children : [children];
}
