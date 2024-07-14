/**
 * @description 创建虚拟DOM节点
 * @param type 组件导出的对象
 * @param props 组件的props
 * @param children 组件的子组件
 */
function createVNode(type, props?, children?) {
  const vnode = {
    type,
    props,
    children,
    el: null,
  };
  return vnode;
}

export { createVNode };
