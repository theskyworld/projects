import { get } from "./base";

// 获取歌曲url
export function processSongs(songs: any) {
  if (!songs.length) {
    return Promise.resolve(songs);
  }

  return get("/api/getSongsUrl", {
    mid: songs.map((song: any) => {
      return song.mid;
    }),
  }).then((result) => {
    const map = result.map;
    return songs
      .map((song: any) => {
        song.url = map[song.mid];
        return song;
      })
      .filter((song: any) => {
        return song.url && song.url.indexOf("vkey") > -1;
      });
  });
}
