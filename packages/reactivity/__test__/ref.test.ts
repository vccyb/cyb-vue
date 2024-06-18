import { count } from "console";
import { effect, targetMap } from "../src/effect";
import { ref } from "../src/ref";
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
});
