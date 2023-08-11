<template>
    <!-- 推荐页面 -->
    <!-- 通过v-loading自定义指令来控制加载数据时Loading组件的渲染展示 -->
    <div class="recommend" v-loading="loading">
        <WrappedScroll class="recommend-content">
            <div>
                <div class="slider-wrapper">
                    <div class="slider-content">
                        <Slide v-if="sliders.length" :sliders="sliders"></Slide>
                    </div>
                </div>
                <div class="recommend-list">
                    <h1 class="list-title" v-show="!loading">热门歌单推荐</h1>
                    <ul>
                        <li v-for="item in albums" class="item" :key="(item as any).id" @click="selectItem(item)">
                            <div class="icon">
                                <img width="60" height="60" v-lazy="(item as any).pic">
                            </div>
                            <div class="text">
                                <h2 class="name">
                                    {{ (item as any).username }}
                                </h2>
                                <p class="title">
                                    {{ (item as any).title }}
                                </p>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </WrappedScroll>
        <router-view v-slot="{ Component }">
            <transition appear name="slide">
                <component :is="Component" :data="selectedAlbum" />
            </transition>
        </router-view>
    </div>
</template>
<script setup lang='ts'>
import { computed, onBeforeMount, ref } from "vue";
import { getRecommend } from "../service/recommend"
import Slide from "../components/base/slide/Slide.vue";
import WrappedScroll from "../components/base/wrappedScroll";
import storage from 'good-storage'
import { useRouter } from "vue-router";

const ALBUM_KEY = '__album__'


const sliders = ref([]);
const albums = ref([]);
const selectedAlbum = ref();
const loading = computed(() => {
    return !sliders.value.length && !albums.value.length
});
// 挂载前获取轮播图数据
onBeforeMount(async () => {
    // 进行数据的请求和获取
    const result = await getRecommend();
    // console.log("result : ", result);
    sliders.value = result.sliders;
    albums.value = result.albums;
});
const router = useRouter();
const cacheAlbum = (album: any) => {
    storage.session.set(ALBUM_KEY, album)
}
const selectItem = (album: any) => {
    selectedAlbum.value = album;
    cacheAlbum(album);
    // router.push({
    //     path: `/recommend/${album.id}`
    // })
}


</script>
<style lang="scss" scoped>
.recommend {
    position: fixed;
    width: 100%;
    top: 88px;
    bottom: 0;
    overflow: scroll;

    .recommend-content {
        height: 100%;
        overflow: hidden;

        .slider-wrapper {
            position: relative;
            width: 100%;
            height: 0;
            padding-top: 40%;
            overflow: hidden;

            .slider-content {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
            }
        }

        .recommend-list {
            .list-title {
                height: 65px;
                line-height: 65px;
                text-align: center;
                font-size: $font-size-medium;
                color: $color-theme;
            }

            .item {
                display: flex;
                box-sizing: border-box;
                align-items: center;
                padding: 0 20px 20px 20px;

                .icon {
                    flex: 0 0 60px;
                    width: 60px;
                    padding-right: 20px;
                }

                .text {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    flex: 1;
                    line-height: 20px;
                    overflow: hidden;
                    font-size: $font-size-medium;
                }

                .name {
                    margin-bottom: 10px;
                    color: $color-text;
                }

                .title {
                    color: $color-text-d;
                }
            }
        }
    }
}
</style>