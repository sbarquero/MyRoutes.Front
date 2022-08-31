import { defineStore } from 'pinia';

import { useAuthStore } from '@/stores/authStore';
import trackApi from '@/api/trackApi';
import type { Track } from '@/interfaces/track.interface';

export const useTrackStore = defineStore({
  id: 'track',
  state: () => ({
    selectedTrackId: '',
    selectedTrackIndex: -1,
    hideTrackIndex: -1,
    tracks: [] as Track[],
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
      this.tracks.push(track.data as Track);
    },
    async selectTrack(index: number) {
      this.selectedTrackId = this.trackList[index]._id;
      const geojsonData = this.trackList[index].geojsonData;

      if (!geojsonData) await this.getTrackByListIndex(index);

      this.trackList[index].visible = true;
      this.selectedTrackIndex = index;
      this.hideTrackIndex = -1;
    },
    async getTrackByListIndex(index: number) {
      const authStore = useAuthStore();
      try {
        const id = this.trackList[index]._id;
        if (authStore.isAuthenticated) {
          const token = await getToken();
          const path = '/' + id;
          const { data } = await trackApi.get(path, {
            headers: { Authorization: `Bearer ${token}` },
          });
          this.trackList[index] = { ...data };
        } else {
          const path = '/public/' + id;
          const { data } = await trackApi.get(path);
          this.trackList[index] = { ...data };
        }
        return { ok: true };
      } catch (error: any) {
        console.error('error', error.message);
        return { ok: false, message: error.response.data.message };
      }
    },
    async removeTrackLayer(index: number) {
      this.hideTrackIndex = index;
      this.trackList[index].visible = false;
      if (this.selectedTrackIndex === index) {
        this.selectedTrackIndex = -1;
        this.selectedTrackId = '';
      }
    },
  },
});

async function getToken(): Promise<string> {
  const authStore = useAuthStore();
  const token = await authStore.getToken();
  return token;
}
