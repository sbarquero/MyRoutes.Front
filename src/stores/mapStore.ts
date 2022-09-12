import { defineStore } from 'pinia';

export interface MapState {
  userLocation: [number, number]; // lat, lng
  initialLocation: [number, number]; // lat, lng
  zoom: number;
}

export const useMapStore = defineStore({
  id: 'map',
  state: (): MapState => ({
    userLocation: [0, 0],
    initialLocation: [40, -4.25],
    zoom: 2.75,
  }),
  getters: {
    isUserLocationReady: state => state.userLocation[0] != 0 && state.userLocation[1] != 0,
  },
  actions: {
    getUserLocation() {
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
