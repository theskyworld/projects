<template>
    <!-- 滚动 -->
    <div ref="rootRef">
        <slot></slot>
    </div>
</template>
<script setup lang='ts'>
import useScroll from './useScroll';
import { ref } from 'vue';

const props = defineProps({
    click: {
        type: Boolean,
        default: true,
    },
    probeType: {
        type: Number,
        default: 0
    }
});

const emit = defineEmits(["scroll"]);

const rootRef = ref(null)
const scroll = useScroll(rootRef, props, emit)
</script>
<style scoped></style>