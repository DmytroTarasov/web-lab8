import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token && !['login', 'signup'].some(elem => config.url.includes(elem))) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config;
});

export const login = (values) => {
  return axios.post(apiUrl + '/login', values);
}

export const signup = (values) => {
  return axios.post(apiUrl + '/register', values);
}

export const getProfileInfo = () => {
  return axios.get(apiUrl + '/profileInfo');
}

export const editProfileInfo = (body) => {
  return axios.patch(apiUrl + '/editProfile', body);
}

export const deleteProfile = () => {
  return axios.delete(apiUrl + '/deleteProfile');
}

export const isAuthenticated = () => {
  const token = localStorage.getItem('token');

  return !!token;
}