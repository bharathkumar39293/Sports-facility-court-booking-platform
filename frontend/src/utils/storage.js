// Small localStorage wrapper that won't throw in SSR or private-mode
const safeStorage = typeof window !== 'undefined' ? window.localStorage : null;

const storage = {
  getItem(key) {
    try {
      return safeStorage ? safeStorage.getItem(key) : null;
    } catch {
      return null;
    }
  },
  setItem(key, value) {
    try {
      if (safeStorage) safeStorage.setItem(key, value);
    } catch {
      /* noop */
    }
  },
  removeItem(key) {
    try {
      if (safeStorage) safeStorage.removeItem(key);
    } catch {
      /* noop */
    }
  },
  clear() {
    try {
      if (safeStorage) safeStorage.clear();
    } catch {
      /* noop */
    }
  }
};

export default storage;

