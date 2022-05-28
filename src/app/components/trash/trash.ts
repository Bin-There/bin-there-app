export interface Trash {
  id?: string;
  location?: google.maps.LatLng;
  photoURL?: string;
  size: string;
  type: string;
  tags: string[];
  note: string;
  userId: string;
  date: Date;
}
