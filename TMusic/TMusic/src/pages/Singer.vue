<template>
    <div>
        <h3>歌手页面</h3>
    </div>
</template>
<script setup lang='ts'>
import { onBeforeMount } from 'vue';
import { getSingerList } from '../service/singer';


onBeforeMount(async () => {
    const result = await getSingerList();
    console.log(result);
})
</script>
<style scoped></style>