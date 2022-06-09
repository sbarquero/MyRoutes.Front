import { defineStore } from "pinia";

export interface MapState {
  userLocation?: [number, number]; // lng, lat
}

export const useMapStore = defineStore({
  id: "map",
  state: (): MapState => ({
    userLocation: undefined,
  }),
  getters: {
    isUserLocationReady: (state) => !!state.userLocation,
  },
  actions: {
    getInitialLocation() {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) =>
          (this.userLocation = [coords.longitude, coords.latitude]),
        (err) => {
          console.log(err);
          throw new Error("No geolocation :( ");
        }
      );
    },
  },
});
