import { isObject } from "@cyb-vue/shared";
describe("isObject", () => {
  it("test", () => {
    expect(isObject({})).toBe(true);
    expect(isObject(1)).toBe(false);
    expect(isObject(null)).toBe(false);
  });
});
