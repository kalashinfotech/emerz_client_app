type TSecureStorageProps = {
  getStoredItem: () => string | null
  setStoredItem: (value: string) => boolean
  removeStoredItem: () => void
}

const useSecureStorage = (key: string): TSecureStorageProps => {
  const getStoredItem = (): string | null => {
    try {
      const value = localStorage.getItem(key)
      return value ? value : null
    } catch (error) {
      console.error(`Error fetching value for ${key}`, error)
      return null
    }
  }

  const setStoredItem = (value: string): boolean => {
    try {
      localStorage.setItem(key, value)
      return true
    } catch (error) {
      console.error(`Error setting value for ${key}`, error)
      return false
    }
  }

  const removeStoredItem = (): boolean => {
    try {
      localStorage.removeItem(key)
      return true
    } catch (error) {
      console.error(`Error removing value for ${key}`, error)
      return false
    }
  }

  return {
    getStoredItem,
    setStoredItem,
    removeStoredItem,
  }
}

export default useSecureStorage
