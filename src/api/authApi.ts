import axios from 'axios';

const authApi = axios.create({
  baseURL: import.meta.env.VITE_AUTH_BASE_URL,
});

export default authApi;
