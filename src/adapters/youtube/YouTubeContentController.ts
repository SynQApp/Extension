import type {
  NativeYouTubeMusicMoviePlayer,
  NativeYouTubeMusicQueueItem,
  NativeYouTubeMusicQueueItemRendererData,
  NativeYouTubeMusicThumbnail,
  YtmApp
} from '~adapters/youtube-music/types';
import type {
  AlbumLinkDetails,
  ArtistLinkDetails,
  ContentController,
  TrackLinkDetails
} from '~core/adapter';
import { RepeatMode } from '~types';
import type { PlaybackState, QueueItem, Track, ValueOrPromise } from '~types';
import { findIndexes } from '~util/findIndexes';
import { lengthTextToSeconds } from '~util/time';

import { YouTubeBackgroundController } from './YouTubeBackgroundController';

export enum YouTubePlayerState {
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

export class YouTubeContentController implements ContentController {
  private _unmuteVolume: number = 50;

  constructor() {}

  public play(): void {
    this.getPlayer().playVideo();
  }

  public playPause(): void {
    if (this.getPlayer().getPlayerState() === YouTubePlayerState.PLAYING) {
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

    this.getPlayer().setVolume(volume);
  }

  public seekTo(time: number): void {
    this.getPlayer().seekTo(time);
  }

  public getPlayerState(): PlaybackState | null {
    return {
      currentTime: Math.round(this.getPlayer().getCurrentTime()),
      isPlaying:
        this.getPlayer().getPlayerState() === YouTubePlayerState.PLAYING,
      volume: this.getPlayer().getVolume(),
      repeatMode: RepeatMode.NO_REPEAT,
      queue: this.getQueue()
    };
  }

  public getCurrentTrack(): Track | null {
    const videoData = this.getPlayer().getVideoData();
    const duration = Math.round(this.getPlayer().getDuration());
    const artistName = videoData.author;
    const name = videoData.title;
    const id = videoData.video_id;

    const albumCoverUrl = `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;

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

    return {
      albumName: '',
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

  public async getTrackLinkDetails(): Promise<TrackLinkDetails | null> {
    const track = this.getCurrentTrack();

    if (!track) {
      return null;
    }

    return {
      albumCoverUrl: track.albumCoverUrl,
      albumName: track.albumName,
      artistName: track.artistName,
      duration: track.duration,
      name: track.name
    };
  }

  public getAlbumLinkDetails(): AlbumLinkDetails | null {
    const nameElement = document.querySelector(
      'h2.ytmusic-detail-header-renderer'
    ) as HTMLElement;
    const name = nameElement?.innerText ?? '';

    const artistNameElement = document.querySelector(
      '#header .subtitle-container a'
    ) as HTMLElement;
    const artistName = artistNameElement?.innerText ?? '';

    const albumCoverUrl = document.querySelector(
      '#thumbnail img'
    ) as HTMLElement;
    const albumCover = albumCoverUrl?.getAttribute('src') ?? '';

    return {
      albumCoverUrl: albumCover,
      artistName,
      name
    };
  }

  public getArtistLinkDetails(): ValueOrPromise<ArtistLinkDetails | null> {
    const nameElement = document.querySelector('#header .title') as HTMLElement;
    const name = nameElement?.innerText ?? '';

    const imageElement = document.querySelector(
      '#header source'
    ) as HTMLElement;
    const artistImageUrl = imageElement?.getAttribute('srcset') ?? '';

    return {
      artistImageUrl,
      name
    };
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
    const link = new YouTubeBackgroundController().getLink({
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
}
