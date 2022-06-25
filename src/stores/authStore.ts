import authApi from '@/api/authApi';
import { defineStore } from 'pinia';

export interface LoginUserDto {
  email: string;
  password: string;
}

export interface RefreshTokenDto {
  userId: string;
  sessionId: string;
  refreshToken: string;
}

export interface AuthResponseDto {
  userId: string;
  userName: string;
  email: string;
  rol: string;
  token: string;
  sessionId: string;
  refreshToken: string;
  expireAt: Date;
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
    expireAt: new Date(0),
  }),
  getters: {
    currentState: state => state.status,
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
    async refresh() {
      this.status = 'authenticating';
      const hasRefreshToken = localStorage.getItem('refreshToken') != '';
      if (!hasRefreshToken) return;
      try {
        const { data } = await authApi.post('/refresh', {
          userId: localStorage.getItem('userId'),
          sessionId: localStorage.getItem('sessionId'),
          refreshToken: localStorage.getItem('refreshToken'),
        });

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
