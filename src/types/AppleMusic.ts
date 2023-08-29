export interface NativeAppleMusicMediaItem {
  attributes: {
    artwork: {
      url: string;
    };
    albumName: string;
    artistName: string;
    name: string;
    playParams: {
      id: string;
    };
    durationInMillis: number;
  };
}

export interface NativeAppleMusicQueueItem {
  item: NativeAppleMusicMediaItem;
}

export interface NativeAppleMusicUser {
  subscription: {
    active: boolean;
  };
}

export interface AppleMusicApi {
  search: (
    query: string,
    options: { limit: number; types: string }
  ) => Promise<{
    songs: {
      data: NativeAppleMusicMediaItem[];
    };
  }>;
}

export interface MusicKit {
  play: () => void;
  pause: () => void;
  skipToNextItem: () => void;
  skipToPreviousItem: () => void;
  repeatMode: number;
  volume: number;
  isPlaying: boolean;
  currentPlaybackTime: number;
  seekToTime: (time: number) => void;
  nowPlayingItem: NativeAppleMusicMediaItem;
  nowPlayingItemIndex: number;
  queue: {
    _queueItems: NativeAppleMusicQueueItem[];
  };
  changeToMediaItem: (id: string) => void;
  changeToMediaAtIndex: (index: number) => void;
  playLater: (options: { song: string }) => Promise<void>;
  me: () => Promise<NativeAppleMusicUser>;
  api: AppleMusicApi;
  addEventListener: (event: string, callback: () => void) => void;
  removeEventListener: (event: string, callback: () => void) => void;
}
