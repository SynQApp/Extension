import type { Store } from 'redux';

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
  getDuration: () => number;
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
  playerUiState_: 'INACTIVE';
}

export interface YtmSearchResultRun {
  text: string;
  navigationEndpoint?: {
    clickTrackingParams: string;
    browseEndpoint: {
      browseId: string;
    };
  };
}

export interface YtmSearchApiResultMusicCardShelfRenderer {
  musicCardShelfRenderer: {
    subtitle: {
      runs: YtmSearchResultRun[];
    };
    thumbnail: {
      thumbnails: NativeYouTubeMusicThumbnail[];
    };
    title: {
      runs: YtmSearchResultRun[];
    };
  };
}

export interface YtmSearchApiResultMusicResponsiveListItemRenderer {
  musicResponsiveListItemRenderer: {
    flexColumns: {
      musicResponsiveListItemFlexColumnRenderer: {
        text: {
          runs: YtmSearchResultRun[];
        };
      };
    }[];
    navigationEndpoint: {
      browseEndpoint: {
        browseId: string;
      };
    };
  };
}

export interface YtmSearchApiResultMusicShelfRenderer {
  musicShelfRenderer: {
    contents: YtmSearchApiResultMusicResponsiveListItemRenderer[];
    title: {
      runs: YtmSearchResultRun[];
    };
  };
}

export interface YtmSearchApiResult {
  contents: {
    tabbedSearchResultsRenderer: {
      tabs: {
        tabRenderer: {
          content: {
            sectionListRenderer: {
              contents: (
                | YtmSearchApiResultMusicCardShelfRenderer
                | YtmSearchApiResultMusicShelfRenderer
              )[];
            };
          };
        };
      }[];
    };
  };
}
