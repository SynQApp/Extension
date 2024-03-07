import type { Store } from 'redux';

import type {
  AmznMusic,
  Maestro,
  NativeAmazonMusicQueueItem
} from '~adapters/amazon-music/types';
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
import { normalizeVolume } from '~util/volume';
import { waitForElement } from '~util/waitForElement';

declare let window: Window & {
  __REDUX_STORES__: (Store & { name: string })[];
  amznMusic: AmznMusic;
  maestro: {
    getInstance(): Promise<Maestro>;
  };
};

const SKYFIRE_STORE_NAME = 'DMWebPlayerSkyfire';

const REPEAT_ACTIONS_MAP: Record<RepeatMode, string> = {
  [RepeatMode.NO_REPEAT]: 'PlaybackInterface.v1_0.RepeatOffMethod',
  [RepeatMode.REPEAT_ONE]: 'PlaybackInterface.v1_0.RepeatOneMethod',
  [RepeatMode.REPEAT_ALL]: 'PlaybackInterface.v1_0.RepeatAllMethod'
};

const REPEAT_STATES_MAP: Record<string, RepeatMode> = {
  OFF: RepeatMode.NO_REPEAT,
  ONE: RepeatMode.REPEAT_ONE,
  ALL: RepeatMode.REPEAT_ALL
};

interface AmazonQueueItem extends QueueItem {
  /**
   * Amazon Music uses a queue entity ID in addition to the ASIN/track ID.
   */
  queueItemId: string;
}

/**
 * In general, the strategy for controlling Amazon Music is to use the DMWebPlayerSkyfire
 * Redux store we exposed in the amazon-music-redux-init content script. Then we can
 * dispatch actions to the store to control playback.
 */
export class AmazonContentController implements ContentController {
  private _unmuteVolume = 50;
  private _queueFetching = false;

  public play(): void {
    const playButtonContainer = document.querySelector(
      'music-button[icon-name="play"]'
    );
    const playButton = playButtonContainer?.shadowRoot?.querySelector('button');

    playButton?.click();
  }

  public playPause(): void {
    if (this.getStore()?.getState().PlaybackStates.play.state === 'PAUSED') {
      this.play();
    } else {
      this.pause();
    }
  }

  public pause(): void {
    const pauseButtonContainer = document.querySelector(
      'music-button[icon-name="pause"]'
    );
    const pauseButton =
      pauseButtonContainer?.shadowRoot?.querySelector('button');

    pauseButton?.click();
  }

  public next(): void {
    const nextButtonContainer = document.querySelector(
      'music-button[icon-name="next"]'
    );
    const nextButton = nextButtonContainer?.shadowRoot?.querySelector('button');

    nextButton?.click();
  }

  public previous(): void {
    const previousButtonContainer = document.querySelector(
      'music-button[icon-name="previous"]'
    );
    const previousButton =
      previousButtonContainer?.shadowRoot?.querySelector('button');

    previousButton?.click();
  }

  public toggleRepeatMode(): void {
    const prevRepeatMode =
      REPEAT_STATES_MAP[
        this.getStore()?.getState().PlaybackStates.repeat.state
      ];
    let newRepeatMode: RepeatMode;

    switch (prevRepeatMode) {
      case RepeatMode.NO_REPEAT:
        newRepeatMode = RepeatMode.REPEAT_ALL;
        break;
      case RepeatMode.REPEAT_ALL:
        newRepeatMode = RepeatMode.REPEAT_ONE;
        break;
      case RepeatMode.REPEAT_ONE:
        newRepeatMode = RepeatMode.NO_REPEAT;
        break;
    }

    this.getStore()?.dispatch({
      type: REPEAT_ACTIONS_MAP[newRepeatMode]
    });
  }

  /**
   * Toggle the like button.
   *
   * The store dispatch option of toggling like/dislike is more complicated
   * than the DOM manipulation option, so we'll use the DOM manipulation option.
   */
  public toggleLike(): void {
    const likeButton = document.querySelector(
      'music-button[icon-name="like"]'
    ) as HTMLElement;

    if (!likeButton) {
      throw new Error('Could not find like button');
    }

    likeButton.click();
  }

  /**
   * Toggle the dislike button.
   *
   * The store dispatch option of toggling like/dislike is more complicated
   * than the DOM manipulation option, so we'll use the DOM manipulation option.
   */
  public async toggleDislike(): Promise<void> {
    const moreButton = document.querySelector(
      '#transport music-button[icon-name="more"]'
    ) as HTMLElement;

    if (!moreButton) {
      throw new Error('Could not find more button');
    }

    moreButton.click();

    try {
      const dislikeButton = await waitForElement(
        '#contextMenuOverlay music-list-item[primary-text="Dislike"], #contextMenuOverlay music-list-item[primary-text="Undo Dislike"]'
      );

      (dislikeButton as HTMLElement).click();
    } catch (e) {
      console.error(e);
    }
  }

  public async toggleMute(): Promise<void> {
    const maestro = await this.getMaestroInstance();
    const volume = maestro.getVolume() * 100;

    if (volume === 0) {
      this.setVolume(this._unmuteVolume);
    } else {
      this._unmuteVolume = volume;
      this.setVolume(0);
    }
  }

  public async setVolume(volume: number, relative?: boolean): Promise<void> {
    if (relative) {
      const maestro = await this.getMaestroInstance();
      const currentVolume = maestro.getVolume() * 100;
      volume = currentVolume + volume;
    }

    volume = normalizeVolume(volume);

    this.getStore()?.dispatch({
      type: 'PlaybackInterface.v1_0.SetVolumeMethod',
      payload: {
        volume: volume / 100
      }
    });
  }

  public seekTo(time: number): void {
    this.getStore()?.dispatch({
      type: 'PLAYBACK_SCRUBBED',
      payload: {
        position: time
      }
    });
  }

  public async getPlayerState(): Promise<PlaybackState> {
    const maestro = await this.getMaestroInstance();

    const appState = this.getStore()?.getState();
    const playbackStates = appState.PlaybackStates;

    return {
      currentTime: Math.round(maestro.getCurrentTime()),
      isPlaying: maestro.isPlaying(),
      repeatMode: REPEAT_STATES_MAP[playbackStates?.repeat?.state],
      volume: maestro.getVolume() * 100,
      queue: await this.getQueue()
    };
  }

  public getCurrentTrack(): Track | null {
    const appState = this.getStore()?.getState();
    const media = appState.Media;

    if (!media) {
      return null;
    }

    const songInfo: Track = {
      id: media.mediaId,
      name: media.title,
      albumName: media.albumName,
      albumCoverUrl: media.artwork,
      artistName: media.artistName,
      duration: media.durationSeconds,
      isLiked: this._isCurrentTrackLiked(),
      isDisliked: this._isCurrentTrackDisliked()
    };

    return songInfo;
  }

  public async getQueue(): Promise<AmazonQueueItem[]> {
    const appState = this.getStore()?.getState();
    let queue = appState.Media?.playQueue?.widgets?.[0]
      ?.items as NativeAmazonMusicQueueItem[];

    // Amazon Music loads the queue only after a user tries to access it. If the
    // queue is not loaded yet, we'll try to load it.
    if (!queue && !this._queueFetching) {
      this._queueFetching = true;
      queue = await this._fetchQueue();
      this._queueFetching = false;
    }

    const queueItems =
      queue?.map((item) => {
        const queueItem: AmazonQueueItem = {
          track: this._queueItemToSongInfo(item),
          isPlaying: false,
          queueItemId: item.id
        };

        return queueItem;
      }) || [];

    const currentSongInfo = await this.getCurrentTrack();
    const currentQueueItem: AmazonQueueItem = {
      track: currentSongInfo,
      isPlaying: true,
      queueItemId: ''
    };

    queueItems.unshift(currentQueueItem);

    return queueItems;
  }

  public async playQueueTrack(id: string, duplicateIndex = 0): Promise<void> {
    const currentTrack = await this.getCurrentTrack();

    // If current track is the same as the one we want to play, just restart it
    if (currentTrack?.id === id && duplicateIndex === 0) {
      this.seekTo(0);
      return;
    }

    const queueItems = await this.getQueue();

    const trackIndexes = findIndexes(
      queueItems,
      (item) => item.track?.id === id
    );
    const trackIndex = trackIndexes[duplicateIndex];

    const queueItem = queueItems[trackIndex];

    if (!queueItem?.track || !currentTrack) {
      return;
    }

    const playTrackAction = this._createPlayAtQueueEntityAction(
      queueItem.track?.id,
      queueItem.queueItemId,
      currentTrack?.id
    );

    this.getStore()?.dispatch(playTrackAction);
  }

  public getTrackLinkDetails(): ValueOrPromise<TrackLinkDetails | null> {
    const searchParams = new URLSearchParams(window.location.search);
    const trackId = searchParams.get('trackAsin');

    const appState = this.getStore()?.getState();
    const pageData = appState?.TemplateStack?.currentTemplate?.innerTemplate;

    const artistName = pageData?.headerPrimaryText;
    const albumName = pageData?.headerImageAltText;
    const albumCoverUrl = pageData?.headerImage;

    const trackList =
      appState?.TemplateStack?.currentTemplate?.innerTemplate?.widgets?.[0]
        ?.items;

    const track = trackList?.find(
      (item: any) => item.isSelected?.states?.true === trackId
    );

    if (!track) {
      return null;
    }

    return {
      name: track.primaryText,
      artistName,
      albumName,
      albumCoverUrl,
      duration: lengthTextToSeconds(track.secondaryText3)
    };
  }

  public getAlbumLinkDetails(): ValueOrPromise<AlbumLinkDetails | null> {
    const appState = this.getStore()?.getState();
    const pageData = appState?.TemplateStack?.currentTemplate?.innerTemplate;

    const artistName = pageData?.headerPrimaryText;
    const albumName = pageData?.headerImageAltText;
    const albumCoverUrl = pageData?.headerImage;

    return {
      name: albumName,
      artistName,
      albumCoverUrl
    };
  }

  public getArtistLinkDetails(): ValueOrPromise<ArtistLinkDetails | null> {
    const appState = this.getStore()?.getState();
    const pageData = appState?.TemplateStack?.currentTemplate?.innerTemplate;

    const name = pageData?.headerText?.text;
    const artistImageUrl = pageData?.backgroundImage;

    return {
      name,
      artistImageUrl
    };
  }

  private async _fetchQueue(): Promise<NativeAmazonMusicQueueItem[]> {
    const appState = this.getStore()?.getState();

    // If no active queue (especially for podcasts), return empty array
    if (!appState?.Media?.onActiveQueuesDataRequired?.length) {
      return [];
    }

    this.getStore()?.dispatch(
      this._createLoadQueueAction(appState.Media?.mediaId)
    );

    return await new Promise((resolve) => {
      // 20 attempts * 250ms = 5 seconds
      let remainingAttempts = 20;

      const interval = setInterval(() => {
        if (!remainingAttempts) {
          clearInterval(interval);
          resolve([]);
        }

        const appState = this.getStore()?.getState();
        const curQueue = appState.Media?.playQueue?.widgets?.[0]?.items;

        if (curQueue) {
          clearInterval(interval);
          resolve(curQueue);
        }

        remainingAttempts--;
      }, 250);
    });
  }

  private _queueItemToSongInfo(item: NativeAmazonMusicQueueItem): Track | null {
    const searchParams = new URLSearchParams(
      item?.primaryLink?.deeplink?.split('?')[1]
    );

    const trackId = searchParams.get('trackAsin');

    if (!trackId) {
      return null;
    }

    return {
      id: trackId,
      name: item.primaryText,
      artistName: item.secondaryText1,
      albumName: item.secondaryText2,
      albumCoverUrl: item.image,
      duration: lengthTextToSeconds(item.secondaryText3)
    };
  }

  private _isCurrentTrackLiked(): boolean {
    const appState = this.getStore()?.getState();
    const rating = appState.Storage.RATINGS?.TRACK_RATING;

    return rating === 'THUMBS_UP';
  }

  private _isCurrentTrackDisliked(): boolean {
    const appState = this.getStore()?.getState();
    const rating = appState.Storage.RATINGS?.TRACK_RATING;

    return rating === 'THUMBS_DOWN';
  }

  private async _isPlayerReady(): Promise<boolean> {
    const maestro = await this.getMaestroInstance();
    return !!maestro?.getAudioPlayer()?.getAudioElement();
  }

  /**
   * _playerReady could be false if either the player is actually not ready,
   * or if we haven't checked yet. First check if API can be used, and if not,
   * initialize the player.
   */
  private async _preparePlayer() {
    const isPlayerReady = await this._isPlayerReady();

    if (!isPlayerReady) {
      await this._forceInitializePlayer();
    }
  }

  /**
   * If the player hasn't been interacted with, other methods will fail. This method
   * clicks the play button to initialize the player and then again once it has
   * started playing to pause it.
   */
  private async _forceInitializePlayer() {
    return new Promise((resolve) => {
      this.getMaestroInstance().then((maestro) => {
        const isMuted = maestro.getVolume() === 0;

        if (isMuted) {
          this.toggleMute();
        }

        const playButtons = document.querySelectorAll(
          'music-button[icon-name="play"]'
        );

        const mainPlayButton = playButtons[
          playButtons.length - 1
        ] as HTMLElement;

        mainPlayButton.click();

        const observer = new MutationObserver(
          async (mutations, observerInstance) => {
            if (mainPlayButton.getAttribute('icon-name') === 'pause') {
              setTimeout(() => {
                mainPlayButton.click();

                if (isMuted) {
                  this.toggleMute();
                }
              }, 100);

              observerInstance.disconnect();
              resolve(void 0);
            }
          }
        );

        observer.observe(mainPlayButton, {
          attributes: true,
          attributeFilter: ['aria-label']
        });
      });
    });
  }

  private _createLoadQueueAction(currentTrackId: string) {
    return {
      payload: {
        queue: {
          interface: 'QueuesInterface.v1_0.MultiThreadedQueue',
          id: 'MT_HTTP'
        },
        method: {
          interface: 'InteractionInterface.v1_0.InvokeHttpSkillMethod',
          url: 'https://na.mesk.skill.music.a2z.com/api/showVisualPlayQueue?userHash=%7B%22level%22%3A%22HD_MEMBER%22%7D',
          clientInformation: [],
          before: [],
          after: [],
          onSuccess: [],
          onError: [],
          queue: {
            interface: 'QueuesInterface.v1_0.MultiThreadedQueue',
            id: 'MT_HTTP'
          },
          forced: false,
          owner: currentTrackId
        }
      },
      type: 'ENQUEUE_SKYFIRE_METHOD'
    };
  }

  private _createPlayAtQueueEntityAction(
    trackId: string,
    entityId: string,
    currentTrackId: string
  ) {
    return {
      payload: {
        queue: {
          interface: 'QueuesInterface.v1_0.SingleThreadedQueue',
          id: 'ST_HTTP'
        },
        method: {
          interface: 'InteractionInterface.v1_0.InvokeHttpSkillMethod',
          url: `https://na.mesk.skill.music.a2z.com/api/playAtQueueEntity?trackId=${trackId}&entityId=${entityId}&metricsInfo=&userHash=%7B%22level%22%3A%22HD_MEMBER%22%7D`,
          clientInformation: [
            'PlaybackInterface.v1_0.MediaStateClientInformation',
            'PlaybackInterface.v1_0.LyricLinesClientInformation'
          ],
          before: [],
          after: [],
          onSuccess: [],
          onError: [],
          queue: {
            interface: 'QueuesInterface.v1_0.SingleThreadedQueue',
            id: 'ST_HTTP'
          },
          forced: false,
          owner: currentTrackId
        }
      },
      type: 'ENQUEUE_SKYFIRE_METHOD'
    };
  }

  public async getMaestroInstance() {
    return await window.maestro.getInstance();
  }

  public getStore() {
    return window.__REDUX_STORES__.find(
      (store) => store.name === SKYFIRE_STORE_NAME
    );
  }
}
