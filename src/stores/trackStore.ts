import { defineStore } from 'pinia';

// import { useAuthStore } from '@/stores/authStore';
import type { Track, TrackList } from '@/interfaces/track.interface';
import trackApi from '@/api/trackApi';

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
    async getTrackById(id: string) {
      this.selectedTrack._id = id;
      try {
        // const authStore = useAuthStore();
        const path = '/' + id;
        // const token = await authStore.getToken();
        const { data } = await trackApi.get(
          path,
          /* { headers: { Authorization: `Bearer ${token}` }, }*/
        );
        this.selectedTrack = { ...data };
        return { ok: true };
      } catch (error: any) {
        console.error('error', error.message);
        return { ok: false, message: error.response.data.message };
      }
    },
    async getTrackListByUserId(userId: string): Promise<void> {
      try {
        const path = 'user/' + userId;
        const response = await trackApi.get(path);
        this.tracks = response.data;
      } catch (error: any) {
        console.error('error', error.message);
        this.tracks = [];
      }
    }
  },
});
