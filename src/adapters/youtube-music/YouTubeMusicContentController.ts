import { getLink } from '@synq/music-service-clients';

import type {
  NativeYouTubeMusicMoviePlayer,
  NativeYouTubeMusicQueueItem,
  NativeYouTubeMusicQueueItemRendererData,
  NativeYouTubeMusicThumbnail,
  YtConfig,
  YtmApp
} from '~adapters/youtube-music/types';
import type { ContentController, LinkTrack } from '~core/adapter';
import { RepeatMode } from '~types';
import type { PlaybackState, QueueItem, Track, ValueOrPromise } from '~types';
import { findIndexes } from '~util/findIndexes';
import { lengthTextToSeconds } from '~util/time';

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

export class YouTubeMusicContentController implements ContentController {
  private _unmuteVolume: number = 50;

  constructor() {}

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

    const volumeSlider = document.getElementById(
      'volume-slider'
    ) as HTMLElement;
    volumeSlider?.setAttribute('value', volume.toString());

    const changeEvent = new Event('change');
    volumeSlider?.dispatchEvent(changeEvent);
  }

  public seekTo(time: number): void {
    this.getPlayer().seekTo(time);
  }

  public getPlayerState(): PlaybackState | null {
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
    const additionalInfo = document
      .querySelector('.byline.ytmusic-player-bar')
      ?.textContent?.split('\u2022');
    const albumName = additionalInfo?.[1]?.trim() ?? '';
    const albumCoverUrl =
      document.querySelector('#song-image img')?.getAttribute('src') ?? '';

    const videoData = this.getPlayer().getVideoData();
    const artistName = videoData.author;
    const name = videoData.title;
    const id = videoData.video_id;

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
    const durationText = document
      .getElementById('progress-bar')
      ?.getAttribute('aria-valuemax');
    const duration = durationText ? lengthTextToSeconds(durationText) : 0;

    return {
      albumName,
      albumCoverUrl,
      artistName,
      name,
      isDisliked,
      isLiked,
      duration,
      id
    };
  }

  public getQueue(): QueueItem[] {
    const queue = document.getElementById('queue');

    if (!queue) {
      return [];
    }

    const state = (queue as unknown as YtmApp['store']).getState();

    const ytQueueItems = state.queue.items;
    const currentSongIndex = state.queue.selectedItemIndex;

    return ytQueueItems.map((item, index) => {
      const queueItem: QueueItem = {
        track: this._queueItemToSongInfo(item),
        isPlaying: index === currentSongIndex
      };

      return queueItem;
    });
  }

  public playQueueTrack(id: string, duplicateIndex = 0): ValueOrPromise<void> {
    const queueItems = this.getQueue();

    const trackIndexes = findIndexes(
      queueItems,
      (item) => item.track?.id === id
    );
    const trackIndex = trackIndexes[duplicateIndex];

    const queue = document.getElementById(
      'queue'
    ) as unknown as YtmApp['store'];
    queue.dispatch({ type: 'SET_INDEX', payload: trackIndex });
  }

  public async getLinkTrack(): Promise<LinkTrack> {
    const track = this.getCurrentTrack();

    if (!track) {
      return null;
    }

    return track;
  }

  private _longBylineToArtistAlbum(longBylineRuns: { text: string }[]) {
    if (longBylineRuns.length === 1) {
      const artist = longBylineRuns[0].text;
      return { artist, album: '' };
    }

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
    const link = getLink({
      musicService: 'YOUTUBEMUSIC',
      type: 'TRACK',
      trackId
    });

    return {
      albumCoverUrl,
      albumName: album,
      artistName: artist,
      duration: lengthTextToSeconds(rendererData.lengthText.runs[0].text),
      id: trackId,
      link,
      name: trackName
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
