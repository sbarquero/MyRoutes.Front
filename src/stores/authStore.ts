import authApi from '@/api/authApi';
import { defineStore } from 'pinia';

export interface LoginUserDto {
  email: string;
  password: string;
}

export const useAuthStore = defineStore({
  id: 'auth',
  state: () => ({
    status: 'authenticating',
    userName: '',
    email: '',
    rol: '',
    token: '',
    refreshToken: '',
  }),
  getters: {
    currentState: state => state.status,
    isAuthenticated: state => state.status === 'authenticated',
  },
  actions: {
    async login(user: LoginUserDto) {
      this.status = 'authenticating';
      const { email, password } = user;
      try {
        const { data } = await authApi.post('/login', { email, password });
        const { userName, token, refreshToken } = data;

        if (token) {
          this.userName = userName;
          this.email = email;
          this.token = data.token;
          this.rol = data.rol;
          this.refreshToken = refreshToken;
          localStorage.setItem('token', token);
          this.status = 'authenticated';
        }

        return { ok: true };
      } catch (error: any) {
        this.status = 'not-authenticated';
        return { ok: false, message: error.response.data.message };
      }
    },
    logout() {
      this.userName = '';
      this.email = '';
      this.token = '';
      this.rol = '';
      this.refreshToken = '';
      localStorage.removeItem('token');
      this.status = 'not-authenticated';
    },
  },
});
