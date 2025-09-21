/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_NAME: string
  readonly VITE_APP_TITLE: string
  readonly VITE_WATERMARK_CONTENT: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
