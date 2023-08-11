import { createApp } from "vue";
import { addClass, removeClass } from "./dom";

const relativeCls = "g-relative";

export default function createLoadingDirective(Comp: any) {
  return {
    mounted(el: any, binding: any) {
      const app = createApp(Comp);
      const instance =  app.mount(document.createElement("div"));
      const name = Comp.__name;
      if (!el[name]) {
        el[name] = {};
      }
      el[name].instance = instance;
      const title = binding.arg;
      if (typeof title !== "undefined") {
        // debugger;
        (instance as any).setTitle(title);
      }

      if (binding.value) {
        append(el);
      }
    },
    updated(el: any, binding: any) {
      const title = binding.arg;
      const name = Comp.__name;
      if (typeof title !== "undefined") {
        el[name].instance.setTitle(title);
      }
      if (binding.value !== binding.oldValue) {
        binding.value ? append(el) : remove(el);
      }
    },
  };

  function append(el: any) {
    const name = Comp.__name;
    const style = getComputedStyle(el);
    if (["absolute", "fixed", "relative"].indexOf(style.position) === -1) {
      addClass(el, relativeCls);
    }
    el.appendChild(el[name].instance.$el);
  }

  function remove(el: any) {
    const name = Comp.__name;
    removeClass(el, relativeCls);
    el.removeChild(el[name].instance.$el);
  }
}
