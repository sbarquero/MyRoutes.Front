import type { FeatureCollection, GeoJsonProperties, Geometry } from 'geojson';

export interface Track {
  _id: string;
  name: string;
  description: string;
  userId: string;
  isPublic: boolean;
  createAt: Date;
  updateAt: Date;
  geojsonData: FeatureCollection<Geometry, GeoJsonProperties>;
}

export interface TrackList {
  _id: string;
  name: string;
  description: string;
  userId: string;
  isPublic: boolean;
  createAt: Date;
  updateAt: Date;
  visible: boolean;
}
