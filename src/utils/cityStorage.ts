// utils/cityStorage.js
export const getSavedCity = () => {
  return localStorage.getItem('userCity');
};

export const saveCity = (city) => {
  localStorage.setItem('userCity', city);
};