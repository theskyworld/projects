import { defineStore } from "pinia";
import { load } from "../assets/ts/arrayStore";
import { PLAY_MODE, SEARCH_KEY } from "../assets/ts/constant";

const useMainStore = defineStore("mainStore", {
  state: () => {
    return {
      sequenceList: [],
      playlist: [],
      playing: false,
      playMode: PLAY_MODE.sequence,
      currentIndex: 0,
      fullScreen: false,
      favoriteList: [],
      searchHistory: load(SEARCH_KEY),
      playHistory: [],
    };
  },
  actions: {
    setPlayingState(playing: any) {
      this.playing = playing;
    },
    setSequenceList(list: any) {
      this.sequenceList = list;
    },
    setPlaylist(list: any) {
      this.playlist = list;
    },
    setPlayMode(mode: any) {
      this.playMode = mode;
    },
    setCurrentIndex(index: any) {
      this.currentIndex = index;
    },
    setFullScreen(fullScreen: any) {
      this.fullScreen = fullScreen;
    },
    setFavoriteList(list: any) {
      this.favoriteList = list;
    },
    addSongLyric({ song, lyric } : any) {
      this.sequenceList.map((item) => {
        if ((item as any).mid === song.mid) {
          (item as any).lyric = lyric;
        }
        return item;
      });
    },
    setSearchHistory(searches: any) {
      this.searchHistory = searches;
    },
    setPlayHistory(songs: any) {
      this.playHistory = songs;
    },
  },
});

export default useMainStore;
