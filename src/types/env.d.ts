/// <reference types="vite/client" />

/**
 * 环境变量类型定义
 */
interface ImportMetaEnv {
  /** 应用名称 */
  readonly VITE_APP_NAME: string
  /** 应用标题 */
  readonly VITE_APP_TITLE: string
  /** 默认水印内容 */
  readonly VITE_DEFAULT_WATERMARK: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
