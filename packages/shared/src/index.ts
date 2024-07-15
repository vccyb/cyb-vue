import { ShapeFlags } from "./shapFlags";

/**
 *
 * @param value 判断的值
 * @returns { boolean } 是否object类型
 */
export const isObject = (value: any) => {
  return value !== null && typeof value === "object";
};

/**
 * shared
 */
export const extend = Object.assign;

export const hasChanged = (value, oldValue) => !Object.is(value, oldValue);

export { ShapeFlags } from "./shapFlags";
