import { mergeConfig, defineConfig } from 'vitest/config'
import viteConfig from './vite.config'
import path from 'path'

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      globals: true
    },
    resolve: {
      alias: [
        {
          find: /@cyb-vue\/(.+)/i,
          replacement: path.resolve(__dirname, "packages", "$1/src")
        }
      ]
    }
  })
)