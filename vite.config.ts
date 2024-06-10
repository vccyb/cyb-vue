import { defineConfig } from "vite";
import path from "path";

const resolvePath = (...args: string[]) => path.resolve(__dirname, ...args);

export default defineConfig({
  test: {
    globals: true, //支持全局导入
  },
  resolve: {
    alias: [
      {
        find: /@cyb-vue\/(.+)/i,
        replacement: resolvePath("packages", "$1/src"),
      },
    ],
  },
});
