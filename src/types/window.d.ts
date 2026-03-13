declare global {
  interface Window {
    navigation?: {
      canGoBack: boolean
      canGoForward: boolean
    }
    loaderElement?: HTMLElement | null
  }
}

export {}
