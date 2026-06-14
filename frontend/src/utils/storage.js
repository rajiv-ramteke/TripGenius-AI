export const getUserKey = (baseKey) => {
  try {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (user && user.email) {
      return `${baseKey}_${user.email}`;
    }
  } catch (e) {
    console.error('Error reading currentUser', e);
  }
  return `${baseKey}_guest`;
};

export const getStorage = (baseKey, defaultValue = []) => {
  try {
    const key = getUserKey(baseKey);
    return JSON.parse(localStorage.getItem(key)) || defaultValue;
  } catch (e) {
    console.error(`Error reading ${baseKey} from storage`, e);
    return defaultValue;
  }
};

export const setStorage = (baseKey, data) => {
  try {
    const key = getUserKey(baseKey);
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error(`Error writing ${baseKey} to storage`, e);
  }
};
