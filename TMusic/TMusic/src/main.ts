import { createApp } from "vue";
import App from "./App.vue";
// 引入sass全局样式
import "./assets/scss/index.scss";
import router from "./router";
import { createPinia } from "pinia";

const app = createApp(App);

createApp(App).use(router).use(createPinia()).mount("#app");
