import CryptoJS from 'crypto-js';
import { LOCAL_STORAGE_KEY } from 'config/constants';

export const encrypt = (text) => {
  return CryptoJS.AES.encrypt(
    JSON.stringify(text),
    LOCAL_STORAGE_KEY
  ).toString();
};

export const decrypt = (ciphertext) => {
  const bytes = CryptoJS.AES.decrypt(ciphertext, LOCAL_STORAGE_KEY);
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
};

export const md5 = (text) => {
  return CryptoJS.MD5(text).toString();
};
