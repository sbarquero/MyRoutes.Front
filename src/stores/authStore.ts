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
    userId: '',
    sessionId: '',
    refreshToken: '',
    expireAt: null,
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
        const { userName, rol, token, userId, sessionId, refreshToken, expireAt } = data;

        if (token) {
          this.userName = userName;
          this.email = email;
          this.token = token;
          this.rol = rol;
          this.userId = userId;
          this.sessionId = sessionId;
          this.refreshToken = refreshToken;
          this.expireAt = expireAt;
          localStorage.setItem('token', token);
          this.status = 'authenticated';
        }

        return { ok: true };
      } catch (error: any) {
        this.status = 'not-authenticated';
        return { ok: false, message: error.response.data.message };
      }
    },
    async logout() {
      try {
        await authApi.post('/logout', {
          userId: this.userId,
          sessionId: this.sessionId,
          refreshToken: this.refreshToken,
        });

        return { ok: true, message: 'Successfully logged out' }
      } catch (error: any) {
        return { ok: false, message: error.response.data.message };
      } finally {
        this.userName = '';
        this.email = '';
        this.token = '';
        this.rol = '';
        this.userId = '';
        this.sessionId = '';
        this.expireAt = null;
        this.refreshToken = '';
        localStorage.removeItem('token');
        this.status = 'not-authenticated';
      }
    },
  },
});
