export function initSlots(instance, children) {
  // 保证 $slots 一定是存放 vnode 的数组
  // instance.slots = Array.isArray(children) ? children : [children];

  //  slots是对象
  const slots = {};
  if (children) normalizeObjectSlots(children, instance.slots);
}

function normalizeObjectSlots(children: any, slots: any) {
  for (const [key, value] of Object.entries<any>(children)) {
    if (typeof value === "object") {
      slots[key] = normalizeSlots(value);
    } else if (typeof value === "function") {
      slots[key] = (props) => normalizeSlots(value(props));
    }
  }
}

function normalizeSlots(value: any) {
  return Array.isArray(value) ? value : [value];
}
