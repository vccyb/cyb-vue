(function(global, factory) {
  typeof exports === "object" && typeof module !== "undefined" ? factory(exports) : typeof define === "function" && define.amd ? define(["exports"], factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, factory(global.CybVue = {}));
})(this, function(exports2) {
  "use strict";
  function hello() {
    console.log("hello world");
  }
  exports2.hello = hello;
  Object.defineProperty(exports2, Symbol.toStringTag, { value: "Module" });
});
