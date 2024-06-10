/**
 *
 * @param value 判断的对象
 * @returns {boolean} 对象是否上object类型
 */
export const isObject = (value: any) => {
  return value !== null && typeof value === "object";
};
