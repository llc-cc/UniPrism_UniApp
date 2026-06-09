export function readStorage<T>(key: string, fallback: T): T {
  try {
    const value = uni.getStorageSync(key) as T
    return value === '' || value === undefined || value === null ? fallback : value
  } catch {
    return fallback
  }
}

export function writeStorage<T>(key: string, value: T) {
  uni.setStorageSync(key, value)
}

export function removeStorage(key: string) {
  uni.removeStorageSync(key)
}
