<template>
   <div class="singer-detail">
      <MusicList :songs="songs" :title="title" :pic="pic" :loading="loading"></MusicList>
   </div>
</template>
<script lang='ts'>
import { getSingerDetail } from '../service/singer';
import MusicList from "../components/musicList/MusicList.vue"
import { SINGER_KEY } from '../assets/ts/constant';
import createDetailComponent from '../assets/ts/createDetailComponent';
import { onBeforeMount } from 'vue';
import { processSongs } from '../service/song';



export default createDetailComponent('singer-detail', SINGER_KEY, getSingerDetail)
</script>
<style lang="scss" scoped>
.singer-detail {
   position: fixed;
   z-index: 10;
   top: 0;
   left: 0;
   bottom: 0;
   right: 0;
   background: $color-background;
}
</style>