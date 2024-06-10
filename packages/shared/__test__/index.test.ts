import * as shard from "../src";

describe("isObject", () => {
  const { isObject } = shard;
  it("should return true when value is object", () => {
    expect(isObject({})).toBe(true);
    expect(isObject([])).toBe(true);
    expect(isObject(new Date())).toBe(true);
    expect(isObject(new RegExp())).toBe(true);
    expect(isObject(new String())).toBe(true);
    expect(isObject(new Number())).toBe(true);
    expect(isObject(Math)).toBe(true);
  });

  it("should return false when value is null", () => {
    expect(isObject(null)).toBe(false);
  });

  it("should return false when value is boolean", () => {
    expect(isObject(false)).toBe(false);
    expect(isObject(true)).toBe(false);
  });

  it("should return false when value is number", () => {
    expect(isObject(1)).toBe(false);
  });
});
