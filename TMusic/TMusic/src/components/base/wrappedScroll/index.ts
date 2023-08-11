import {
  h,
  mergeProps,
  withCtx,
  renderSlot,
  ref,
  computed,
  watch,
  nextTick,
} from "vue";
import Scroll from "../scroll/Scroll.vue";
import useMainStore from "../../../store";
import { storeToRefs } from "pinia";

export default {
  name: "wrap-scroll",
  props: Scroll.props,
  emits: Scroll.emits,
  render(ctx: any) {
    return h(
      Scroll,
      mergeProps(
        {
          ref: "scrollRef",
        },
        ctx.$props,
        {
          onScroll: (e: any) => {
            ctx.$emit("scroll", e);
          },
        }
      ),
      {
        default: withCtx(() => {
          return [renderSlot(ctx.$slots, "default")];
        }),
      }
    );
  },
  setup() {
    const scrollRef = ref(null);
    const scroll = computed(() => {
      return (scrollRef.value as any).scroll;
    });

    const mainStore = useMainStore();
    const playlist = computed(() => storeToRefs(mainStore.playlist as any));

    watch(playlist, async () => {
      await nextTick();
      scroll.value.refresh();
    });

    return {
      scrollRef,
      scroll,
    };
  },
};
