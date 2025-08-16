import { useStorage } from '@vueuse/core'
import { defineStore } from 'pinia'

import packageJson from '@/../package.json'

type SystemInfoOptions = {
  version: string
}

const DEFAULT_SYSTEM_INFO_OPTIONS: SystemInfoOptions = {
  version: packageJson.version,
}

export const useSystemStore = defineStore('systemStore', () => {
  const systemInfo = useStorage<SystemInfoOptions>('systemInfo', DEFAULT_SYSTEM_INFO_OPTIONS)

  return {
    systemInfo,
  }
})
