export interface NativeSpotifyTrack {
  id: string;
  name: string;
  artists: {
    name: string;
  }[];
  album: {
    images: {
      url: string;
    }[];
    name: string;
  };
  duration_ms: number;
}
