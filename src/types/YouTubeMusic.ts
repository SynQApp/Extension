import type { Store } from 'redux';

export interface YtConfig {
  IS_SUBSCRIBER: boolean;
}

export interface NativeYouTubeMusicNavigationRequest {
  data: {
    videoId: string;
    watchEndpointMusicSupportedConfigs: {
      watchEndpointMusicConfig: {
        musicVideoType: string;
      };
    };
  };
}

export interface NativeYouTubeMusicQueueItem {
  playlistPanelVideoWrapperRenderer: {
    primaryRenderer: {
      playlistPanelVideoRenderer: NativeYouTubeMusicQueueItemRendererData;
    };
  };
  playlistPanelVideoRenderer: NativeYouTubeMusicQueueItemRendererData;
}

export interface NativeYouTubeMusicTextRun {
  text: string;
}

export interface NativeYouTubeMusicThumbnail {
  url: string;
  width: number;
  height: number;
}

export interface NativeYouTubeMusicQueueItemRendererData {
  videoId: string;
  title: {
    runs: NativeYouTubeMusicTextRun[];
  };
  longBylineText: {
    runs: NativeYouTubeMusicTextRun[];
  };
  thumbnail: {
    thumbnails: NativeYouTubeMusicThumbnail[];
  };
  lengthText: {
    runs: NativeYouTubeMusicTextRun[];
  };
}

export interface NativeYouTubeMusicMoviePlayer {
  addEventListener: (event: string, callback: () => void) => void;
  getCurrentTime: () => number;
  getPlayerState: () => number;
  getVideoData: () => {
    author: string;
    title: string;
    video_id: string;
  };
  getVideoUrl: () => string;
  getVolume: () => number;
  nextVideo: () => void;
  pauseVideo: () => void;
  playVideo: () => void;
  previousVideo: () => void;
  removeEventListener: (event: string, callback: () => void) => void;
  seekTo: (seconds: number) => void;
  setVolume: (volume: number) => void;
}

export interface YtmAppState {
  player: {
    playerResponse: {
      videoDetails: {
        videoId: string;
      };
    };
  };
  queue: {
    items: NativeYouTubeMusicQueueItem[];
    selectedItemIndex: number;
  };
}

export interface YtmApp {
  store: Store<YtmAppState>;
  navigator_: {
    navigate: (request: NativeYouTubeMusicNavigationRequest) => void;
    originalNavigate: (request: NativeYouTubeMusicNavigationRequest) => void;
  };
  navigate_: (path: string) => void;
  playerUiState_: 'INACTIVE';
}
