import { get } from "./base";

// 获取歌手名列表
export function getSingerList() {
  return get("/api/getSingerList");
}

// 获取指定歌手详细信息
export function getSingerDetail(singer: any) {
  return get("/api/getSingerDetail", {
    mid: singer.mid,
  });
}
