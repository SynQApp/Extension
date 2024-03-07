export interface NativeSpotifyPodcastTrack {
  type: 'episode';
  id: string;
  uri: string;
  name: string;
  show: {
    name: string;
    publisher: string;
  };
  images: {
    url: string;
  }[];
  duration_ms: number;
}

export interface NativeSpotifySongTrack {
  type: 'track';
  id: string;
  uri: string;
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

export interface NativeSpotifyAlbum {
  type: 'album';
  id: string;
  uri: string;
  name: string;
  artists: {
    name: string;
  }[];
  images: {
    url: string;
  }[];
}

export interface NativeSpotifyArtist {
  type: 'artist';
  id: string;
  uri: string;
  name: string;
  images: {
    url: string;
  }[];
}

export type NativeSpotifyTrack =
  | NativeSpotifyPodcastTrack
  | NativeSpotifySongTrack;
