import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData:
          // 全局引入sass函数和变量
          // 引入一些非具体实现的样式，如定义的变量、定义的函数，以供在任意组件中对
          // 全局的具体样式通过main.ts引入
          `
          @import "./src/assets/scss/mixin.scss";
          @import "./src/assets/scss/variable.scss";
          
          `,
      },
    },
  },
});
