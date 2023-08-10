import { createApp } from "vue";
import App from "./App.vue";
// 引入sass全局样式
import "./assets/scss/index.scss";
import router from "./router";

createApp(App).use(router).mount("#app");
