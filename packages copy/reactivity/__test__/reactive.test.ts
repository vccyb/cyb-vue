import { reactive, isReactive, isProxy } from "../src/reactive";

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

  it("isProxy", () => {
    const original = { foo: 1 } as { foo: number };
    const observed = reactive(original);

    expect(isProxy(observed)).toBe(true);
    expect(isProxy(original)).toBe(false);
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

  it("reactive params type must be object", () => {
    console.warn = vi.fn();
    //@ts-ignore
    const original = reactive(1);
    expect(original).toBe(1);
  });

  it("observed value should return some proxy if nested", () => {
    const original = {
      foo: 1,
    };

    const observed = reactive(original);
    const observed2 = reactive(observed);

    expect(observed2).toBe(observed);
  });

  it("reactive multi observed same target", () => {
    const original = {
      foo: 1,
    };

    const observed = reactive(original);
    const observed2 = reactive(original);

    expect(observed).toBe(observed2);
  });
});
