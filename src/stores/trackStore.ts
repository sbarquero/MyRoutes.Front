import { defineStore } from 'pinia';

import { useAuthStore } from '@/stores/authStore';
import trackApi from '@/api/trackApi';
import type { Track, TrackList } from '@/interfaces/track.interface';


export const useTrackStore = defineStore({
  id: 'track',
  state: () => ({
    selectedTrack: {} as Track,
    tracks: [] as TrackList[],
  }),
  getters: {
    trackList: state => state.tracks,
  },
  actions: {
    async getAllPublic() {
      try {
        const path = 'public/';
        const response = await trackApi.get(path);
        this.tracks = response.data;
        this.tracks.forEach(track => (track.visible = false));
      } catch (error: any) {
        console.error('error', error.message);
        this.tracks = [];
      }
    },
    async getTrackById(id: string) {
      this.selectedTrack._id = id;
      const authStore = useAuthStore();
      try {
        if (authStore.isAuthenticated) {
          const token = await getToken();
          const path = '/' + id;
          const { data } = await trackApi.get(path, {
            headers: { Authorization: `Bearer ${token}` },
          });
          this.selectedTrack = { ...data };
        } else {
          const path = '/public/' + id;
          const { data } = await trackApi.get(path);
          this.selectedTrack = { ...data };
        }
        return { ok: true };
      } catch (error: any) {
        console.error('error', error.message);
        return { ok: false, message: error.response.data.message };
      }
    },
    async getTrackListByUserId(userId: string): Promise<void> {
      try {
        const token = await getToken();
        const path = 'user/' + userId;
        const response = await trackApi.get(path, {
          headers: { Authorization: `Bearer ${token}` },
        });
        this.tracks = response.data;
        this.tracks.forEach(track => (track.visible = false));
      } catch (error: any) {
        console.error('error', error.message);
        this.tracks = [];
      }
    },
    async deleteById(id: string) {
      try {
        const token = await getToken();
        const path = '/' + id;
        await trackApi.delete(path, {
          headers: { Authorization: `Bearer ${token}` },
        });
        return { ok: true };
      } catch (error: any) {
        console.error('error', error.message);
        return { ok: false, message: error.response.data.message };
      }
    },
    async upload(formData: FormData) {
      const token = await getToken();
      const track = await trackApi.post('/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      this.tracks.push(track.data as TrackList);
    },
  },
});

async function getToken(): Promise<string> {
  const authStore = useAuthStore();
  const token = await authStore.getToken();
  return token;
}
