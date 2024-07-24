import { effect } from "../src/effect";
import { reactive } from "../src/reactive";
import { ref, isRef, unRef, proxyRefs } from "../src/ref";
describe("ref", () => {
  it("happy path", () => {
    const a = ref(1);
    expect(a.value).toBe(1);
    a.value = 2;
    expect(a.value).toBe(2);
  });

  it("should be reactive", () => {
    const a = ref(1);
    let dummy;
    let calls = 0;
    effect(() => {
      calls++;
      dummy = a.value;
    });

    expect(dummy).toBe(1);
    expect(calls).toBe(1);
    a.value = 2;
    // set
    expect(dummy).toBe(2);
    expect(calls).toBe(2);

    // same value done't trigger
    a.value = 2;
    expect(dummy).toBe(2);
    expect(calls).toBe(2);
  });

  it("should make nested properties reactive", () => {
    let original = {
      count: 1,
    };
    const a = ref(original);

    let dummy;

    effect(() => {
      dummy = a.value.count;
    });

    expect(dummy).toBe(1);
    a.value.count = 2;
    expect(dummy).toBe(2);
    console.dir(a.dep);
  });

  it("isRef", () => {
    const a = ref(1);
    const foo = reactive({ bar: 1 });
    expect(isRef(a)).toBe(true);
    expect(isRef(1)).toBe(false);
    expect(isRef(foo)).toBe(false);
  });

  it("unRef", () => {
    const a = ref(1);
    expect(isRef(a)).toBe(true);
    expect(unRef(a)).toBe(1);
    expect(unRef("123")).toBe("123");
    expect(unRef({ a: 1, b: 2 })).toEqual({ a: 1, b: 2 });
  });

  it("proxyRefs", () => {
    const foo = {
      name: "foo",
      age: ref(20),
    };

    const proxyFoo = proxyRefs(foo);

    // 对于ref属性，可以不通过value获取
    expect(foo.age.value).toBe(20);
    expect(proxyFoo.name).toBe("foo");
    expect(proxyFoo.age).toBe(20);

    // 修改ref属性，不需要修改value
    proxyFoo.age = 25;
    expect(foo.age.value).toBe(25);
    expect(proxyFoo.age).toBe(25);

    proxyFoo.age = ref(30);
    expect(foo.age.value).toBe(30);
    expect(proxyFoo.age).toBe(30);
  });
});
