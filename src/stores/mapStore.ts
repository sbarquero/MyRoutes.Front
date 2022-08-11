import { defineStore } from 'pinia';

export interface MapState {
  userLocation: [number, number]; // lng, lat
}

export const useMapStore = defineStore({
  id: 'map',
  state: (): MapState => ({
    userLocation: [0, 0],
  }),
  getters: {
    isUserLocationReady: state => !!state.userLocation,
  },
  actions: {
    getInitialLocation() {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => (this.userLocation = [coords.longitude, coords.latitude]),
        err => {
          console.error(err);
          throw new Error('No geolocation :( ');
        },
      );
    },
  },
});
