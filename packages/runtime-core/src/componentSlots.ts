export function initSlots(instance, children) {
  // 保证 $slots 一定是存放 vnode 的数组
  // instance.slots = Array.isArray(children) ? children : [children];

  //  slots是对象
  const slots = {};
  if (children) normalizeObjectSlots(children, instance.slots);
}

function normalizeObjectSlots(children, slots) {
  for (const [key, value] of Object.entries(children)) {
    slots[key] = normalizeSlots(value);
  }
}

function normalizeSlots(value) {
  return Array.isArray(value) ? value : [value];
}
