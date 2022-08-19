import { defineStore } from 'pinia';

export interface MapState {
  userLocation: [number, number]; // lat, lng
}

export const useMapStore = defineStore({
  id: 'map',
  state: (): MapState => ({
    userLocation: [0, 0],
  }),
  getters: {
    isUserLocationReady: state => state.userLocation[0] != 0 && state.userLocation[1] != 0,
  },
  actions: {
    getInitialLocation() {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => (this.userLocation = [coords.latitude, coords.longitude]),
        err => {
          console.error(err);
          throw new Error('No geolocation :( ');
        },
      );
    },
  },
});
