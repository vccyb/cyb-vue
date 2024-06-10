import { defineConfig, mergeConfig } from "vitest/config";
import viteConfig from "./vite.config";
import path from "path";
export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      globals: true,
      include: ["./**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    },
    resolve: {
      alias: [
        {
          find: /@cyb-vue\/(.+)/i,
          replacement: path.resolve(__dirname, "packages", "$1/src"),
        },
      ],
    },
  })
);
