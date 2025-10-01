import packageJson from '@/../package.json'

export function checkVersion() {
  const storageKey = 'version'
  const currentVersion = packageJson.version
  const storedVersion = localStorage.getItem(storageKey)

  if (storedVersion !== currentVersion) {
    localStorage.clear()
    sessionStorage.clear()

    window.location.reload()
  }

  localStorage.setItem(storageKey, currentVersion)
}
