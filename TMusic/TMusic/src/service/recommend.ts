// 轮播图请求

import { get } from "./base";

export function getRecommend() {
  return get("/api/recommend");
}
