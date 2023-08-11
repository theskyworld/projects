import { ref, computed } from "vue";

// 用于右侧大写字母对歌手名的定位
export default function useShortcut(props: any, groupRef: any) {
  const ANCHOR_HEIGHT = 18;
  const scrollRef = ref(null);

  const shortcutList = computed(() => {
    return props.data.map((group: any) => {
      return group.title;
    });
  });

  const touch = {};

  // 实现点击大写字母,定位到对应的歌手
  function onShortcutTouchStart(e: any) {
    const anchorIndex = parseInt(e.target.dataset.index);
    (touch as any).y1 = e.touches[0].pageY;
    (touch as any).anchorIndex = anchorIndex;

    scrollTo(anchorIndex);
  }

  // 实现在右侧大写字母区域中的滚动效果
  function onShortcutTouchMove(e: any) {
    (touch as any).y2 = e.touches[0].pageY;
    const delta = (((touch as any).y2 - (touch as any).y1) / ANCHOR_HEIGHT) | 0;
    const anchorIndex = (touch as any).anchorIndex + delta;

    scrollTo(anchorIndex);
  }

  function scrollTo(index: any) {
    if (isNaN(index)) {
      return;
    }
    index = Math.max(0, Math.min(shortcutList.value.length - 1, index));
    const targetEl = groupRef.value.children[index];
    const scroll = (scrollRef.value as any).scroll;
    scroll.scrollToElement(targetEl, 0);
  }

  return {
    shortcutList,
    scrollRef,
    onShortcutTouchStart,
    onShortcutTouchMove,
  };
}
