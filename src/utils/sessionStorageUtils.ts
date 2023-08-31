/*
Copyright © 2015 Infrared5, Inc. All rights reserved.

The accompanying code comprising examples for use solely in conjunction with Red5 Pro (the "Example Code")
is  licensed  to  you  by  Infrared5  Inc.  in  consideration  of  your  agreement  to  the  following
license terms  and  conditions.  Access,  use,  modification,  or  redistribution  of  the  accompanying
code  constitutes your acceptance of the following license terms and conditions.

Permission is hereby granted, free of charge, to you to use the Example Code and associated documentation
files (collectively, the "Software") without restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit
persons to whom the Software is furnished to do so, subject to the following conditions:

The Software shall be used solely in conjunction with Red5 Pro. Red5 Pro is licensed under a separate end
user  license  agreement  (the  "EULA"),  which  must  be  executed  with  Infrared5,  Inc.
An  example  of  the EULA can be found on our website at: https://account.red5pro.com/assets/LICENSE.txt.

The above copyright notice and this license shall be included in all copies or portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,  INCLUDING  BUT
NOT  LIMITED  TO  THE  WARRANTIES  OF  MERCHANTABILITY, FITNESS  FOR  A  PARTICULAR  PURPOSE  AND
NONINFRINGEMENT.   IN  NO  EVENT  SHALL INFRARED5, INC. BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN  AN  ACTION  OF  CONTRACT,  TORT  OR  OTHERWISE,  ARISING  FROM,  OUT  OF  OR  IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
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
