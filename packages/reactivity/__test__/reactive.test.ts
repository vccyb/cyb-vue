import { reactive, isReactive } from "../src/reactive";

describe("reactive", () => {
  it("happy path", () => {
    const original = { foo: 1 };
    const observed = reactive(original) as { foo: number };

    expect(observed).not.toBe(original);
    expect(observed.foo).toBe(1);
  });

  it("isReactive", () => {
    const original = { foo: 1 } as { foo: number };
    const observed = reactive(original);

    expect(isReactive(observed)).toBe(true);
    expect(isReactive(original)).toBe(false);
  });

  it("nested reactive", () => {
    const original = {
      nested: {
        foo: 1,
      },
      array: [{ bar: 2 }],
    };

    const observed = reactive(original);
    expect(isReactive(observed.nested)).toBe(true);
    expect(isReactive(observed.array)).toBe(true);
    expect(isReactive(original.array[0])).toBe(false);
  });
});
