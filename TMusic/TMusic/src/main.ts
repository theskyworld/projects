import { createApp } from "vue";
import App from "./App.vue";
// 引入sass全局样式
import "./assets/scss/index.scss";
import router from "./router";
import { createPinia } from "pinia";
// 实现图片懒加载
import lazyPlugin from "vue3-lazy";

createApp(App)
  .use(router)
  .use(createPinia())
  .use(lazyPlugin, {
    // 加载图片时展示的默认图片
    loading: require("./assets/imgs/logo.png"),
  })
  .mount("#app");
