// src/services/storageService.ts

/**
 * Creates a storage handler with automatic JSON parsing and error handling.
 * @param storage - The web storage object (localStorage or sessionStorage).
 * @returns An object with get, set, and remove methods.
 */
const createStorage = (storage: Storage) => ({
  /**
   * Retrieves an item from storage and parses it as JSON.
   * @param key - The key of the item to retrieve.
   * @returns The parsed object, or null if not found or if parsing fails.
   */
  get<T>(key: string): T | null {
    try {
      const item = storage.getItem(key);
      return item ? (JSON.parse(item) as T) : null;
    } catch (error) {
      console.error(`Error getting item "${key}" from ${storage}`, error);
      return null;
    }
  },

  /**
   * Serializes an object to JSON and saves it to storage.
   * @param key - The key under which to save the item.
   * @param value - The object to save.
   */
  set<T>(key: string, value: T): void {
    try {
      const item = JSON.stringify(value);
      storage.setItem(key, item);
    } catch (error) {
      console.error(`Error setting item "${key}" in ${storage}`, error);
    }
  },

  /**
   * Removes an item from storage.
   * @param key - The key of the item to remove.
   */
  remove(key: string): void {
    try {
      storage.removeItem(key);
    } catch (error) {
      console.error(`Error removing item "${key}" from ${storage}`, error);
    }
  },
});

export const storageService = {
  local: createStorage(localStorage),
  session: createStorage(sessionStorage),
};
