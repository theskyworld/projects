import { createServer, defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import express from "express";
import registerRouter from "./backEnd/router.js";

// https://vitejs.dev/config/
export default defineConfig(() => {
  return {
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
    // 后端请求代理
    server: {
      proxy: {
        // 将本地以"/api"开头的请求代理到"http://localhost:9002"服务器
        // 转由服务器向QQ音乐后端获取数据,实现跨域
        "/api": "http://localhost:9002",
      },
    },
  };
});
