/**
 * It gets a value from the session storage
 * @param {string} key - The key to store the data under.
 * @returns The value of the key in the storage.
 */
const get = (key: string): any => {
  if (window.sessionStorage) {
    return window.sessionStorage.getItem(key)
  }
}

/**
 * It removes a key from the Storage
 * @param {string} key - The key of the item you want to remove.
 */
const remove = (key: string): any => {
  if (window.sessionStorage) {
    window.sessionStorage.removeItem(key)
  }
}

/**
 * It sets a key-value pair in session storage.
 * @param {string} key - The key to store the data under.
 * @param {any} value - The value to be stored.
 */
const set = (key: string, value: any): any => {
  if (window.sessionStorage) {
    sessionStorage.setItem(key, value)
  }
}
/* Exporting the functions as a single object. */
export const SessionStorage = {
  get,
  remove,
  set,
}
