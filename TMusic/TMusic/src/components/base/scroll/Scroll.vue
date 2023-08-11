<template>
    <!-- 滚动 -->
    <!-- 使用optionsAPI的写法,用于解决外部获取不到当前组件实例中属性的问题 -->
    <!-- 例如useShortCut.ts文件中const scroll = (scrollRef.value as any).scroll;无法获取到scroll属性 -->
    <div ref="rootRef">
        <slot></slot>
    </div>
</template>

<script>
import useScroll from './useScroll'
import { ref } from 'vue'

export default {
    name: 'scroll',
    props: {
        click: {
            type: Boolean,
            default: true
        },
        probeType: {
            type: Number,
            default: 0
        }
    },
    emits: ['scroll'],
    setup(props, { emit }) {
        const rootRef = ref(null)
        const scroll = useScroll(rootRef, props, emit)

        return {
            rootRef,
            scroll
        }
    }
}
</script>
