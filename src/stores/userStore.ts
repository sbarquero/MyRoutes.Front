import { defineStore } from 'pinia';

import type { User, UpdateUserDto } from '@/interfaces/user.interface';
import { useAuthStore } from '@/stores/authStore';
import userApi from '@/api/userApi';

export const useUserStore = defineStore({
  id: 'user',
  state: () => ({
    isNewUser: false,
    userEditing: false,
    selectedUser: {} as User,
    userInitialState: '',
  }),
  getters: {
    user: state => state.selectedUser,
    // isNewUser: state => state.isNewUser,
    createDate: state => state.selectedUser.createAt || new Date(),
    upateDate: state => state.selectedUser.updateAt || new Date(),
    getUserState: (state): string => {
      return JSON.stringify({
        name: state.selectedUser.name,
        email: state.selectedUser.email,
        active: state.selectedUser.active,
        rol: state.selectedUser.rol,
      });
    },
  },
  actions: {
    async getUser(id: string) {
      this.selectedUser._id = id;
      try {
        const authStore = useAuthStore();
        await authStore.refresh();
        const token = localStorage.getItem('token');
        const path = '/' + id;
        const { data } = await userApi.get(path, {
          headers: { Authorization: `Bearer ${token}` },
        });
        this.selectedUser = { ...data };
        this.userInitialState = this.getUserState;
        return { ok: true };
      } catch (error: any) {
        this.clearUser();
        console.log('error', error.message);
        return { ok: false, message: error.response.data.message };
      }
    },
    clearUser() {
      this.isNewUser = false;
      this.userEditing = false;
      this.selectedUser = {} as User;
      this.userInitialState = '';
    },
    newUser() {
      this.isNewUser = true;
      this.userEditing = true;
      this.selectedUser = {} as User;
      this.selectedUser.active = true;
      this.selectedUser.rol = 'user';
      this.userInitialState = this.getUserState;
    },
    async createUser() {
      try {
        const authStore = useAuthStore();
        const user = {
          name: this.selectedUser.name,
          email: this.selectedUser.email,
          password: this.selectedUser.password,
          rol: this.selectedUser.rol,
          active: this.selectedUser.active,
        };
        await authStore.refresh();
        const token = localStorage.getItem('token');
        const path = '';
        await userApi.post(path, user, {
          headers: { Authorization: `Bearer ${token}` },
        });
        this.isNewUser = false;
        this.userEditing = false;
        return { ok: true };
      } catch (error: any) {
        this.clearUser();
        console.log('error', error.message);
        return { ok: false, message: error.response.data.message };
      }
    },
    async updateUser() {
      try {
        const authStore = useAuthStore();
        const user: UpdateUserDto = {
          name: this.selectedUser.name,
          rol: this.selectedUser.rol,
          active: this.selectedUser.active,
          password: this.selectedUser.password == '' ? undefined : this.selectedUser.password,
        };
        const token = localStorage.getItem('token');
        const path = '/' + this.selectedUser._id;
        await authStore.refresh();
        await userApi.put(path, user, {
          headers: { Authorization: `Bearer ${token}` },
        });
        this.isNewUser = false;
        this.userEditing = false;
        return { ok: true };
      } catch (error: any) {
        this.clearUser();
        console.log('error', error.message);
        return { ok: false, message: error.response.data.message };
      }
    },
  },
});
