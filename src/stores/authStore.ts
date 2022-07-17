import { defineStore } from 'pinia';
import type { AuthResponseDto, LoginUserDto, RefreshTokenDto } from '@/interfaces/auth.interface';
import authApi from '@/api/authApi';

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
    expireAt: new Date(0),
  }),
  getters: {
    isAuthenticated: state => state.status === 'authenticated',
    isAdmin: state => state.rol === 'admin',
  },
  actions: {
    async init() {
      this.userId = localStorage.getItem('userId') || '';
      this.sessionId = localStorage.getItem('sessionId') || '';
      this.refreshToken = localStorage.getItem('refreshToken') || '';
      this.rol = localStorage.getItem('rol') || '';
    },
    async login(user: LoginUserDto) {
      this.status = 'authenticating';
      const { email, password } = user;
      try {
        const { data } = await authApi.post('/login', { email, password });

        this.createSession(data);

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

        return { ok: true, message: 'Successfully logged out' };
      } catch (error: any) {
        return { ok: false, message: error.response.data.message };
      } finally {
        this.removeSession();
        this.status = 'not-authenticated';
      }
    },
    async getToken() {
      if (isTokenExpired(this.token)) {
        await this.refresh();
      }
      return this.token;
    },
    async refresh() {
      this.status = 'authenticating';
      const hasRefreshToken = localStorage.getItem('refreshToken') != '';
      if (!hasRefreshToken) return;
      try {
        const { data } = await authApi.post('/refresh', {
          userId: localStorage.getItem('userId'),
          sessionId: localStorage.getItem('sessionId'),
          refreshToken: localStorage.getItem('refreshToken'),
        } as RefreshTokenDto);

        this.createSession(data);

        return { ok: true };
      } catch (error: any) {
        this.removeSession();
        this.status = 'not-authenticated';
        return { ok: false, message: error.response.data.message };
      }
    },
    createSession(user: AuthResponseDto): void {
      const { userName, email, rol, token, userId, sessionId, refreshToken, expireAt } = user;

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
        localStorage.setItem('userId', userId);
        localStorage.setItem('sessionId', sessionId);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('rol', rol);
        this.status = 'authenticated';
      }
    },
    removeSession() {
      this.userName = '';
      this.email = '';
      this.token = '';
      this.rol = '';
      this.userId = '';
      this.sessionId = '';
      this.expireAt = new Date();
      this.refreshToken = '';
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.removeItem('sessionId');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('rol');
    },
  },
});

function isTokenExpired(token: string) {
  const expiry = JSON.parse(atob(token.split('.')[1])).exp;
  return Math.floor(new Date().getTime() / 1000) >= expiry;
}
