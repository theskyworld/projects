// 使用BetterScoll实现滚动的逻辑
import BScroll from "@better-scroll/core";
import ObserveDOM from "@better-scroll/observe-dom";
import { onMounted, onUnmounted, onActivated, onDeactivated, ref } from "vue";

BScroll.use(ObserveDOM);

export default function useScroll(wrapperRef : any, options : any, emit : any) {
  const scroll = ref();

  onMounted(() => {
    const scrollVal = (scroll.value = new BScroll(wrapperRef.value, {
      observeDOM: true,
      ...options,
    }));

    if (options.probeType > 0) {
      scrollVal.on("scroll", (pos : any) => {
        emit("scroll", pos);
      });
    }
  });

  onUnmounted(() => {
    scroll.value.destroy();
  });

  onActivated(() => {
    scroll.value.enable();
    scroll.value.refresh();
  });

  onDeactivated(() => {
    scroll.value.disable();
  });

  return scroll;
}
