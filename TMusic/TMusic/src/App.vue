<script setup lang="ts">
import Header from "./components/header/Header.vue"
import Tab from "./components/tab/tab.vue"
</script>

<template>
    <div>
        <Header></Header>
        <Tab></Tab>
        <RouterView></RouterView>
    </div>
</template>

<style lang="scss" scoped></style>
