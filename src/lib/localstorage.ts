const isWindowDefined = () => typeof window !== "undefined"

class LocalStorage {
  static get(key: string): string | null {
    if (!isWindowDefined()) return null
    return localStorage.getItem(key)
  }

  static set(key: string, value: string): void {
    if (!isWindowDefined()) return
    localStorage.setItem(key, value)
  }

  static remove(key: string): void {
    if (!isWindowDefined()) return
    localStorage.removeItem(key)
  }

  static clear(): void {
    if (!isWindowDefined()) return
    localStorage.clear()
  }

  static has(key: string): boolean {
    if (!isWindowDefined()) return false
    return localStorage.getItem(key) !== null
  }
}

export const {
  get: getStorageItem,
  set: setStorageItem,
  remove: removeStorageItem,
  clear: clearStorage,
  has: isStorageItemSet,
} = LocalStorage
