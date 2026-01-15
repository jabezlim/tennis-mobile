import { differenceInMinutes } from 'date-fns';
import { decrypt, encrypt } from './crypto';

const STORAGE_NAME = 'KIOSK_CLIENT_STORAGE';

const checkLocalStorage = () => {
  if (localStorage.getItem(STORAGE_NAME)) return true;
  return false;
};

export const setAuthData = (data) => {
  //console.log('setAuthData', data);
  removeAuthData();

  const storage = {
    token: data.token,
    user: {
      id: data.id,
      name: data.user_name,
      contact: data.user_contact,
      email: data.user_email,
      type: data.user_type,
    },
    store: encrypt(data.user_store),
    barcode: data.user_barcode,
    remember: data.remember,
    create: new Date().getTime(),
  };
  if (data.app) {
    storage.app = encrypt(data.app);
  }

  localStorage.setItem(STORAGE_NAME, JSON.stringify(storage));
};

export const getAuthData = () => {
  if (checkLocalStorage()) {
    return JSON.parse(localStorage.getItem(STORAGE_NAME));
  }
  return null;
};

export const gatAuthApp = () => {
  if (getAuthData() && getAuthData().app) {
    return decrypt(getAuthData().app);
  } else return null;
};

export const getAuthToken = () => {
  return getAuthData()?.token;
};
export const getAuthUser = () => {
  return getAuthData()?.user;
};
export const getAuthStore = () => {
  return getAuthData() ? JSON.parse(decrypt(getAuthData().store)) : {};
};
export const getAuthBarcode = () => {
  return getAuthData()?.barcode;
};
export const removeAuthData = () => {
  localStorage.removeItem(STORAGE_NAME);
};

export const checkLoggedIn = () => {
  if (checkLocalStorage()) {
    if (
      !getAuthData().remember &&
      differenceInMinutes(new Date(), getAuthData().create) > 120
    ) {
      removeAuthData();
      return false;
    }
    return true;
  }
  return false;
};
