/// <reference types="vite/client" />

// 声明.vue文件的模块类型
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

// 环境变量类型
interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  // 可以添加更多环境变量
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
