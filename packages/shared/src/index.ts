
/**
 * 
 * @param value 判断的值
 * @returns { boolean } 是否object类型
 */
export const isObject = (value: any) => {
  return value !== null && typeof value === 'object'
}