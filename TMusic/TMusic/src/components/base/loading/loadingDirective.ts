import createLoadingDirective from "../../../assets/ts/createLoadingDirective"
import Loading from "./Loading.vue"

// 创建一个自定义的loading指令
// 用于通过指令来在渲染推荐页面数据加载时展示的Loading组件
// 而不是将整个Loading组件导入Recommend组件后进行是否展示控制
const loadingDirective = createLoadingDirective(Loading);

export default loadingDirective;