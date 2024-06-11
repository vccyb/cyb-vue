import { defineConfig } from "vite";
import path from "path";

const resolvePath = (...args: string[]) => path.resolve(__dirname, ...args);

export default defineConfig({
  build: {
    target: 'es2020',
    outDir: "./dist",
    minify: false,
    lib: {
      entry: resolvePath("./packages/vue/src/index.ts"),
      name: "CybVue",
      formats: ["es", "cjs", "umd", "iife"],
      fileName: (format) => `cyb-vue.${format}.js`
    }
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