import { defineStore } from 'pinia';

import type { User } from '@/interfaces/user.interface';
import userApi from '@/api/userApi';

export const useUserStore = defineStore({
  id: 'user',
  state: () => ({
    selectedUser: {} as User,
  }),
  getters: {
    state: state => state.selectedUser,
  },
  actions: {
    async getUser(id: string) {
      this.selectedUser._id = id;
      try {
        const token = localStorage.getItem('token');
        const path = '/' + id;
        const { data } = await userApi.get(path, {
          headers: { Authorization: `Bearer ${token}` },
        });
        this.selectedUser = { ...data };
        return { ok: true };
      } catch (error: any) {
        this.clearUser();
        console.log('error', error.message);
        return { ok: false, message: error.response.data.message };
      }
    },
    clearUser() {
      this.selectedUser = {} as User;
    },
  },
});
