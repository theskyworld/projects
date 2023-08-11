<script setup lang="ts">
import Header from "./components/header/Header.vue"
import Tab from "./components/tab/tab.vue"
</script>

<template>
    <div>
        <!-- 静态组件 -->
        <Header></Header>
        <Tab></Tab>
        <!-- 路由组件 -->
        <RouterView></RouterView>
    </div>
</template>

<style lang="scss" scoped></style>
