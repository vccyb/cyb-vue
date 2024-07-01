import { effect, stop } from "../src/effect";
import { reactive } from "../src/reactive";

describe("effect", () => {
  it("happy path", () => {
    // 响应式对象
    const user = reactive({
      age: 10,
    }) as { age: number };

    let nextAge;
    effect(() => {
      nextAge = user.age + 1;
    });

    expect(nextAge).toBe(11);

    // 触发依赖
    user.age++;
    expect(nextAge).toBe(12);
  });

  it("runner", () => {
    let foo = 10;

    const runner = effect(() => {
      foo++;
      return "f00";
    });

    expect(foo).toBe(11);
    const r = runner();
    expect(foo).toBe(12);
    expect(r).toBe("f00");
  });

  it("scheduler", () => {
    let dummy;
    let run;
    const scheduler = vi.fn(() => {
      run = runner;
    });
    const obj = reactive({ foo: 1 }) as { foo: number };
    const runner = effect(
      () => {
        dummy = obj.foo;
      },
      {
        scheduler,
      }
    );

    expect(scheduler).not.toHaveBeenCalled();
    expect(dummy).toBe(1);

    obj.foo++; //2

    expect(scheduler).toHaveBeenCalledTimes(1);
    expect(dummy).toBe(1);

    run();
    expect(dummy).toBe(2);
  });

  it("stop", () => {
    let dummy;
    const obj = reactive({ prop: 1, testCC: 2 }) as { prop: number };
    const runner = effect(() => {
      dummy = obj.prop;
    });
    obj.prop = 2;
    expect(dummy).toBe(2);

    stop(runner);
    // obj.prop = 3;
    obj.prop++;
    expect(dummy).toBe(2);
    runner();
    expect(dummy).toBe(3);
  });

  it("onStop", () => {
    const onStop = vi.fn();
    const obj = reactive({ prop: 1 }) as { prop: number };
    let dummy;
    const runner = effect(
      () => {
        dummy = obj.prop;
      },
      {
        onStop,
      }
    );
    stop(runner);
    expect(onStop).toHaveBeenCalledTimes(1);
  });

  it("should discover new branches while running auto", () => {
    let dummy;
    const obj = reactive({
      prop: "value",
      run: false,
    });

    const conditionalSpy = vi.fn(() => {
      dummy = obj.run ? obj.prop : "other";
    });

    effect(conditionalSpy);

    expect(dummy).toBe("other");
    expect(conditionalSpy).toHaveBeenCalledTimes(1);

    obj.prop = "Hi";
    expect(dummy).toBe("other");
    expect(conditionalSpy).toHaveBeenCalledTimes(1);

    obj.run = true;
    expect(dummy).toBe("Hi");
    expect(conditionalSpy).toHaveBeenCalledTimes(2);

    obj.prop = "World";
    expect(dummy).toBe("World");
    expect(conditionalSpy).toHaveBeenCalledTimes(3);
  });

  it("should not be triggered by mutating a property, which is used in an inactive branch", () => {
    let dummy;
    const obj = reactive({
      prop: "value",
      run: true,
    });

    const conditionalSpy = vi.fn(() => {
      dummy = obj.run ? obj.prop : "other";
    });

    effect(conditionalSpy);

    expect(dummy).toBe("value");
    expect(conditionalSpy).toHaveBeenCalledTimes(1);

    obj.run = false;
    expect(dummy).toBe("other");
    expect(conditionalSpy).toHaveBeenCalledTimes(2);

    obj.prop = "World";
    expect(dummy).toBe("other");
    expect(conditionalSpy).toHaveBeenCalledTimes(2);
  });

  it("should allow nested effects", () => {
    const nums = reactive({
      num1: 0,
      num2: 1,
      num3: 2,
    });

    const dummy: any = {};
    const childSpy = vi.fn(() => {
      dummy.num1 = nums.num1;
    });

    const childEffect = effect(childSpy);

    const parentSpy = vi.fn(() => {
      dummy.num2 = nums.num2;
      childEffect();
      dummy.num3 = nums.num3;
    });

    effect(parentSpy);

    expect(dummy).toEqual({
      num1: 0,
      num2: 1,
      num3: 2,
    });

    expect(parentSpy).toHaveBeenCalledTimes(1);
    expect(childSpy).toHaveBeenCalledTimes(2);

    // 只触发childEffect
    nums.num1 = 4;
    expect(dummy).toEqual({
      num1: 4,
      num2: 1,
      num3: 2,
    });

    expect(parentSpy).toHaveBeenCalledTimes(1);
    expect(childSpy).toHaveBeenCalledTimes(3);

    // 只触发parentEffect, 触发child
    nums.num2 = 10;
    expect(dummy).toEqual({
      num1: 4,
      num2: 10,
      num3: 2,
    });
    expect(parentSpy).toHaveBeenCalledTimes(2);
    expect(childSpy).toHaveBeenCalledTimes(4);

    // 只触发parentEffect, 触发child
    nums.num3 = 7;
    expect(dummy).toEqual({
      num1: 4,
      num2: 10,
      num3: 7,
    });
    expect(parentSpy).toHaveBeenCalledTimes(3);
    expect(childSpy).toHaveBeenCalledTimes(5);
  });

  it("should avoid implicit infinite recursive loops with itself", () => {
    const counter = reactive({ num: 0 });
    const counterSpy = vi.fn(() => {
      counter.num++;
    });

    effect(counterSpy);
    expect(counter.num).toBe(1);
    expect(counterSpy).toHaveBeenCalledTimes(1);

    counter.num = 4;
    expect(counter.num).toBe(5);
    expect(counterSpy).toHaveBeenCalledTimes(2);
  });
});
