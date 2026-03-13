declare global {
  interface Window {
    /*
     * https://developer.mozilla.org/en-US/docs/Web/API/Navigation
     */
    navigation?: {
      canGoBack: boolean
      canGoForward: boolean
    }
    loaderElement?: HTMLElement | null
  }
}

export {}
