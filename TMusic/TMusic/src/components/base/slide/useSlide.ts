// 使用BetterScroll实现轮播图轮播的逻辑
import BScroll from "@better-scroll/core";
import Slide from "@better-scroll/slide";

import { onMounted, onUnmounted, onActivated, onDeactivated, ref } from "vue";

BScroll.use(Slide);

export default function useSlider(wrapperRef: any) {
  const slider = ref();
  const currentPageIndex = ref(0);

  onMounted(() => {
    // 对BetterScroll进行配置
    const sliderVal = (slider.value = new BScroll(wrapperRef.value, {
      click: true,
      scrollX: true,
      scrollY: false,
      momentum: false,
      bounce: false,
      probeType: 2,
      slide: true,
    }));

    sliderVal.on("slideWillChange", (page: any) => {
      currentPageIndex.value = page.pageX;
    });
  });

  onUnmounted(() => {
    slider.value.destroy();
  });

  onActivated(() => {
    slider.value.enable();
    slider.value.refresh();
  });

  onDeactivated(() => {
    slider.value.disable();
  });

  return {
    slider,
    currentPageIndex,
  };
}
