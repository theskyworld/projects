<template>
    <div class="singer" v-loading="!singers.length">
        <IndexList :data="singers" @select="selectSinger"></IndexList>
        <router-view v-slot="{ Component }">
            <transition appear name="slide">
                <component :is="Component" :data="selectedSinger" />
            </transition>
        </router-view>
    </div>
</template>
<script setup lang='ts'>
import { onBeforeMount, ref } from 'vue';
import { getSingerList } from '../service/singer';
import IndexList from "../components/indexList/IndexList.vue"
import { useRouter } from 'vue-router';
import storage from 'good-storage'
import { SINGER_KEY } from '../assets/ts/constant';

const router = useRouter();
const singers = ref([]);
const selectedSinger = ref();
const selectSinger = (singer: any) => {
    selectedSinger.value = singer;
    cacheSinger(singer);
    // 跳转到指定的歌手详情页
    router.push({
        path: `singer/${singer.mid}`
    })

}

const cacheSinger = (singer: any) => {
    storage.session.set(SINGER_KEY, singer)
}

onBeforeMount(async () => {
    const result = await getSingerList();
    // console.log(result);
    singers.value = result.singers;
})
</script>
<style lang="scss" scoped>
.singer {
    position: fixed;
    width: 100%;
    top: 88px;
    bottom: 0;
}
</style>