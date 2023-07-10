/*
 * @Descripttion: 
 * @version: 
 * @Date: 2023-04-29 22:27:47
 * @LastEditTime: 2023-07-11 00:08:20
 */
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import {
  createStyleImportPlugin,
  ElementPlusResolve
} from 'vite-plugin-style-import'
import * as path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    //设置别名
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@antv/x6': path.resolve('node_modules/@antv/x6/dist/index.js')
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '@use "@/styles/index.scss" as *;'
      }
    }
  },
  plugins: [
    vue(),
    createStyleImportPlugin({
      resolves: [
        ElementPlusResolve()
      ],
      libs: [
        {
          libraryName: 'element-plus',
          esModule: true,
          resolveStyle: (name) => {
            return `element-plus/theme-chalk/${name}.css`
          },
          ensureStyleFile: true // 忽略文件是否存在, 导入不存在的CSS文件时防止错误。
        }
      ]
    })
  ],
  server: {
    port: 8080, //启动端口
    hmr: {
      host: 'localhost',
      port: 8080
    },
    // 设置代理
    proxy: {
      '/api': {
        target: 'http://gpt-meeting-service:8000',
        // target: 'http://0.0.0.0:8000',
        changeOrigin: true
        // rewrite: (path: string) => path.replace(/^\/api/, '')
      }
    }
  }
});
