import { createRouter, createWebHashHistory } from "vue-router";

const Recommend = () => import("../pages/Recommend.vue");
const Singer = () => import("../pages/Singer.vue");
const TopList = () => import("../pages/TopList.vue");
const Search = () => import("../pages/Search.vue");
const SingerDetail = () => import("../pages/SingerDetail.vue");

const routes = [
  // 首页
  {
    path: "/",
    // 将首页重定向至推荐页面
    // 不需要首页组件
    redirect: "./recommend",
  },
  // 推荐页面
  {
    path: "/recommend",
    component: Recommend,
  },
  // 歌手页面
  {
    path: "/singer",
    component: Singer,
    children: [
      // 歌手详情页面
      {
        path: ":id",
        component: SingerDetail,
      },
    ],
  },
  // 排行榜页面
  {
    path: "/top-list",
    component: TopList,
  },
  // 搜索页面
  {
    path: "/search",
    component: Search,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
