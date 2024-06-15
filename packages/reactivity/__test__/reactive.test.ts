import { reactive, readonly } from "../src/reactive";

describe("reactive", () => {
  it("happy path", () => {
    const original = { foo: 1 };
    const observed = reactive(original) as { foo: number };

    expect(observed).not.toBe(original);
    expect(observed.foo).toBe(1);
  });
});

describe("readonly", () => {
  it("happy path", () => {
    const original = { foo: 1, bar: { baz: 2 } };
    const wrapped = readonly(original);

    expect(wrapped).not.toBe(original);
    expect(wrapped.foo).toBe(1);
    expect(wrapped.bar.baz).toBe(2);

    // set can not
    wrapped.foo = 2;
    expect(wrapped.foo).toBe(1);
  });

  it("should call console.warn when set", () => {
    console.warn = vi.fn();
    const user = readonly({ age: 10 });
    user.age = 11;
    expect(console.warn).toBeCalled();
  });
});
