import { NotReadyReason, RepeatMode } from '~types';
import type { PlayerState, QueueItem, Track, ValueOrPromise } from '~types';
import type {
  NativeYouTubeMusicMoviePlayer,
  NativeYouTubeMusicNavigationRequest,
  NativeYouTubeMusicQueueItem,
  NativeYouTubeMusicQueueItemRendererData,
  NativeYouTubeMusicThumbnail,
  YtConfig,
  YtmApp
} from '~types/YouTubeMusic';
import { findIndexes } from '~util/findIndexes';
import { lengthTextToSeconds } from '~util/time';
import { normalizeVolume } from '~util/volume';

import type { MusicController } from '../lib/MusicController';

declare let window: Window & {
  yt: {
    config_: YtConfig;
  };
};

export enum YouTubeMusicPlayerState {
  UNSTARTED = -1,
  ENDED = 0,
  PLAYING = 1,
  PAUSED = 2,
  BUFFERING = 3,
  CUED = 5
}

const REPEAT_STATES_MAP: Record<string, RepeatMode> = {
  'Repeat off': RepeatMode.NO_REPEAT,
  'Repeat one': RepeatMode.REPEAT_ONE,
  'Repeat all': RepeatMode.REPEAT_ALL
};

export class YouTubeMusicController implements MusicController {
  private _unmuteVolume: number = 50;

  constructor() {}

  public prepareForAutoplay(): ValueOrPromise<void> {
    return;
  }

  public play(): void {
    this.getPlayer().playVideo();
  }

  public playPause(): void {
    if (this.getPlayer().getPlayerState() === YouTubeMusicPlayerState.PLAYING) {
      this.pause();
    } else {
      this.play();
    }
  }

  public pause(): void {
    this.getPlayer().pauseVideo();
  }

  public next(): void {
    this.getPlayer().nextVideo();
  }

  public previous(): void {
    this.getPlayer().previousVideo();
  }

  public toggleRepeatMode(): void {
    (document.querySelector('.repeat') as HTMLElement).click();
  }

  public toggleLike(): void {
    // Simulate a click on the like button
    (
      document.querySelector(
        '.ytmusic-player-bar #button-shape-like button'
      ) as HTMLElement
    ).click();
  }

  public toggleDislike(): void {
    // Simulate a click on the dislike button
    (
      document.querySelector(
        '.ytmusic-player-bar #button-shape-dislike button'
      ) as HTMLElement
    ).click();
  }

  public toggleMute(): void {
    const volume = this.getPlayer().getVolume();

    if (volume === 0) {
      this.setVolume(this._unmuteVolume);
    } else {
      this._unmuteVolume = volume;
      this.setVolume(0);
    }
  }

  public setVolume(volume: number, relative?: boolean): void {
    if (relative) {
      volume = this.getPlayer().getVolume() + volume;
    }

    volume = normalizeVolume(volume);

    this.getPlayer().setVolume(volume);

    this._ytmApp.store.dispatch({
      type: 'SET_VOLUME',
      payload: volume
    });
  }

  public seekTo(time: number): void {
    this.getPlayer().seekTo(time);
  }

  public getPlayerState(): PlayerState | null {
    if (this._ytmApp.playerUiState_ === 'INACTIVE') {
      return null;
    }

    const repeatButton = document.querySelector('.repeat.ytmusic-player-bar');
    const repeatButtonLabel = repeatButton?.getAttribute('aria-label');

    if (!repeatButtonLabel) {
      return null;
    }

    const repeatMode =
      REPEAT_STATES_MAP[repeatButtonLabel as keyof typeof REPEAT_STATES_MAP];

    return {
      currentTime: Math.round(this.getPlayer().getCurrentTime()),
      isPlaying:
        this.getPlayer().getPlayerState() === YouTubeMusicPlayerState.PLAYING,
      volume: this.getPlayer().getVolume(),
      repeatMode,
      queue: this.getQueue()
    };
  }

  public getCurrentTrack(): Track | null {
    const videoDetails = this._appState.player?.playerResponse?.videoDetails;

    if (!videoDetails) {
      return null;
    }

    const trackId = videoDetails.videoId;

    const queueItem = this._appState.queue.items.find((queueItem) => {
      const rendererData = this._getQueueItemRendererData(queueItem);

      return rendererData?.videoId === trackId;
    });

    if (!queueItem) {
      return null;
    }

    const songInfo: Track = this._queueItemToSongInfo(queueItem);

    const isLiked =
      (
        document.querySelector(
          '.ytmusic-player-bar #button-shape-like'
        ) as HTMLElement
      )?.getAttribute('aria-pressed') === 'true';

    const isDisliked =
      (
        document.querySelector(
          '.ytmusic-player-bar #button-shape-dislike'
        ) as HTMLElement
      )?.getAttribute('aria-pressed') === 'true';

    songInfo.isLiked = isLiked;
    songInfo.isDisliked = isDisliked;

    return songInfo;
  }

  public getQueue(): QueueItem[] {
    const ytQueueItems = this._appState.queue.items;
    const currentSongIndex = this._appState.queue.selectedItemIndex;

    return ytQueueItems.map((item, index) => {
      const queueItem: QueueItem = {
        track: this._queueItemToSongInfo(item),
        isPlaying: index === currentSongIndex
      };

      return queueItem;
    });
  }

  public isReady(): true | NotReadyReason {
    return true;
  }

  public playQueueTrack(id: string, duplicateIndex = 0): ValueOrPromise<void> {
    const queue = this.getQueue();

    const trackIndexes = findIndexes(queue, (item) => item.track?.id === id);
    const trackIndex = trackIndexes[duplicateIndex];

    this._ytmApp.store.dispatch({ type: 'SET_INDEX', payload: trackIndex });
  }

  private _longBylineToArtistAlbum(longBylineRuns: { text: string }[]) {
    // The last two runs are a separator and the year, album comes before that
    const album = longBylineRuns[longBylineRuns.length - 3].text;

    // The first run(s) are the artist(s)
    const artist = longBylineRuns
      .slice(0, longBylineRuns.length - 4)
      .map((run) => run.text)
      .join('');

    return { artist, album };
  }

  private _getQueueItemRendererData(
    queueItem: NativeYouTubeMusicQueueItem
  ): NativeYouTubeMusicQueueItemRendererData {
    let renderer;

    if (queueItem.playlistPanelVideoWrapperRenderer) {
      renderer =
        queueItem.playlistPanelVideoWrapperRenderer.primaryRenderer
          .playlistPanelVideoRenderer;
    } else if (queueItem.playlistPanelVideoRenderer) {
      renderer = queueItem.playlistPanelVideoRenderer;
    } else {
      throw new Error('Could not find queue item renderer');
    }

    return renderer;
  }

  private _selectAlbumCoverUrl(
    thumbnails: NativeYouTubeMusicThumbnail[]
  ): string | undefined {
    return thumbnails.find((thumbnail) => thumbnail.width >= 100)?.url;
  }

  private _queueItemToSongInfo(queueItem: NativeYouTubeMusicQueueItem): Track {
    const rendererData = this._getQueueItemRendererData(queueItem);

    const trackId = rendererData.videoId;
    const trackName = rendererData.title.runs[0].text;
    const { artist, album } = this._longBylineToArtistAlbum(
      rendererData.longBylineText.runs
    );
    const albumCoverUrl =
      this._selectAlbumCoverUrl(rendererData.thumbnail.thumbnails) ?? '';

    return {
      duration: lengthTextToSeconds(rendererData.lengthText.runs[0].text),
      id: trackId,
      name: trackName,
      artistName: artist,
      albumName: album,
      albumCoverUrl
    };
  }

  public getPlayer() {
    return document.getElementById(
      'movie_player'
    ) as unknown as NativeYouTubeMusicMoviePlayer;
  }

  private get _ytmApp() {
    return document.getElementsByTagName(
      'ytmusic-app'
    )?.[0] as unknown as YtmApp;
  }

  private get _appState() {
    return this._ytmApp.store.getState();
  }
}
