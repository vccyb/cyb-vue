import { isReadonly, shallowReadonly } from "../src/reactive";

describe("shallReadonly", () => {
  it("should not make non-reactive properties reactive", () => {
    const original = { n: { foo: 1 } };
    const wrapped = shallowReadonly(original);

    expect(isReadonly(wrapped)).toBe(true);
    expect(isReadonly(wrapped.n)).toBe(false);
  });
});
