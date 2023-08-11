import { defineStore } from "pinia";

const useMainStore = defineStore("mainStore", {
    state: () => {
        return {
          sequenceList: [],
          playlist: [],
          playing: false,
        //   playMode: PLAY_MODE.sequence,
          currentIndex: 0,
          fullScreen: false,
          favoriteList: [],
        //   searchHistory: load(SEARCH_KEY),
          playHistory: [],
        };
    }
});


export default useMainStore;