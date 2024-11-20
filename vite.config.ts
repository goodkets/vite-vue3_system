import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import type { ConfigEnv, UserConfig } from 'vite'
import { loadEnv } from 'vite'

export default ({ command, mode }: ConfigEnv): UserConfig => {
  const root = process.cwd()
  const env = loadEnv(mode, root)
  return defineConfig({
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src')
      }
    },
    plugins: [vue()],
    // server: {
    //   port: 7001,
    //   proxy: {
    //     '/api': {
    //       target: env.VITE_WEB_API,
    //       changeOrigin: true,
    //       rewrite: (path) => path.replace(/^\/api/, '')
    //     }
    //   }
    // }
  })
}
