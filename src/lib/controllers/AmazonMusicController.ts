import type { Store } from 'redux';

import { NotReadyReason } from '~types/NotReadyReason';
import type { PlayerState, SongInfo } from '~types/PlayerState';
import { RepeatMode } from '~types/RepeatMode';
import type { ValueOrPromise } from '~types/Util';
import { findIndexes } from '~util/findIndexes';
import { lengthTextToSeconds } from '~util/time';
import { waitForElement } from '~util/waitForElement';

import type { IController } from './IController';

declare let window: Window & {
  __REDUX_STORES__: (Store & { name: string })[];
  amznMusic: any;
  maestro: any;
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

interface QueueItem extends SongInfo {
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
export class AmazonMusicController implements IController {
  public play(): void {
    this.getStore().dispatch({
      type: 'PlaybackInterface.v1_0.ResumeMediaMethod',
      payload: {}
    });
  }

  public playPause(): void {
    if (this.getStore().getState().PlaybackStates.play.state === 'PAUSED') {
      this.play();
    } else {
      this.pause();
    }
  }

  public pause(): void {
    this.getStore().dispatch({
      type: 'PlaybackInterface.v1_0.PauseMediaMethod'
    });
  }

  public next(): void {
    this.getStore().dispatch({
      type: 'PlaybackInterface.v1_0.PlayNextMediaMethod',
      payload: {}
    });
  }

  public previous(): void {
    this.getStore().dispatch({
      type: 'PlaybackInterface.v1_0.PlayPreviousMediaMethod',
      payload: {}
    });
  }

  public toggleRepeatMode(): void {
    const prevRepeatMode =
      REPEAT_STATES_MAP[this.getStore().getState().PlaybackStates.repeat.state];
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

    this.getStore().dispatch({
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

  public setVolume(volume: number): void {
    this.getStore().dispatch({
      type: 'PlaybackInterface.v1_0.SetVolumeMethod',
      payload: {
        volume: volume / 100
      }
    });
  }

  public seekTo(time: number): void {
    this.getStore().dispatch({
      type: 'PLAYBACK_SCRUBBED',
      payload: {
        position: time
      }
    });
  }

  /**
   * EXAMPLE IDs:
   * - trackId: B0C546ZZQ5
   *   albumId: B0C5485L91
   *
   * - trackId: B0939X2B44
   *   albumId: B093B55MYN
   */
  public async startTrack(trackId: string, albumId: string): Promise<void> {
    const playTrackAction = this._createStartTrackAction(trackId, albumId);
    this.getStore().dispatch(playTrackAction);
  }

  public async prepareForAutoplay(): Promise<void> {
    await this._preparePlayer();
  }

  public prepareForSession(): Promise<void> {
    return;
  }

  public async getPlayerState(): Promise<PlayerState> {
    const maestro = await this.getMaestroInstance();

    const appState = this.getStore().getState();
    const playbackStates = appState.PlaybackStates;

    return {
      currentTime: Math.round(maestro.getCurrentTime()),
      isPlaying: maestro.isPlaying(),
      repeatMode: REPEAT_STATES_MAP[playbackStates.repeat.state],
      volume: maestro.getVolume() * 100,
      queue: await this.getQueue()
    };
  }

  public getCurrentSongInfo(): ValueOrPromise<SongInfo> {
    const appState = this.getStore().getState();
    const media = appState.Media;

    const songInfo: SongInfo = {
      trackId: media.mediaId,
      trackName: media.title,
      albumName: media.albumName,
      albumCoverUrl: media.artwork,
      artistName: media.artistName,
      duration: media.durationSeconds,
      isLiked: this._isCurrentTrackLiked(),
      isDisliked: this._isCurrentTrackDisliked()
    };

    return songInfo;
  }

  public async getQueue(): Promise<QueueItem[]> {
    const appState = this.getStore().getState();
    let queue = appState.Media?.playQueue?.widgets?.[0]?.items;

    // Amazon Music loads the queue only after a user tries to access it. If the
    // queue is not loaded yet, we'll try to load it.
    if (!queue || !queue.length) {
      queue = await this._fetchQueue();
    }

    const songInfoQueue =
      queue?.map((item: any) => this._queueItemToSongInfo(item)) || [];

    const currentTrack = await this.getCurrentSongInfo();
    songInfoQueue.unshift(currentTrack);

    return songInfoQueue;
  }

  public async isReady(): Promise<true | NotReadyReason> {
    const maestro = await this.getMaestroInstance();

    if (!maestro.getConfig()?.tier?.includes('UNLIMITED')) {
      return NotReadyReason.NON_PREMIUM_USER;
    }

    if (!(await this._isPlayerReady())) {
      return NotReadyReason.AUTOPLAY_NOT_READY;
    }

    return true;
  }

  public async playQueueTrack(id: string, duplicateIndex = 0): Promise<void> {
    const currentTrack = await this.getCurrentSongInfo();

    // If current track is the same as the one we want to play, just restart it
    if (currentTrack.trackId === id && duplicateIndex === 0) {
      this.seekTo(0);
      return;
    }

    const queueItems = await this.getQueue();

    const trackIndexes = findIndexes(queueItems, (item) => item.trackId === id);
    const trackIndex = trackIndexes[duplicateIndex];

    const queueItem = queueItems[trackIndex];

    const playTrackAction = this._createPlayAtQueueEntityAction(
      queueItem.trackId,
      queueItem.queueItemId,
      currentTrack.trackId
    );

    this.getStore().dispatch(playTrackAction);
  }

  private async _fetchQueue(): Promise<any> {
    const appState = this.getStore().getState();

    this.getStore().dispatch(
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

        const appState = this.getStore().getState();
        const curQueue = appState.Media?.playQueue?.widgets?.[0]?.items;

        if (curQueue && curQueue.length) {
          clearInterval(interval);
          resolve(curQueue);
        }

        remainingAttempts--;
      }, 250);
    });
  }

  private _queueItemToSongInfo(item: any): QueueItem {
    const searchParams = new URLSearchParams(
      item?.primaryLink?.deeplink?.split('?')[1]
    );

    const trackId = searchParams.get('trackAsin');

    return {
      trackId,
      trackName: item.primaryText,
      artistName: item.secondaryText1,
      albumName: item.secondaryText2,
      albumCoverUrl: item.image,
      duration: lengthTextToSeconds(item.secondaryText3),
      queueItemId: item.id
    };
  }

  private _isCurrentTrackLiked(): boolean {
    const appState = this.getStore().getState();
    const rating = appState.Storage.RATINGS?.TRACK_RATING;

    return rating === 'THUMBS_UP';
  }

  private _isCurrentTrackDisliked(): boolean {
    const appState = this.getStore().getState();
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
      // TODO: Temporarily mute the player so it doesn't make any noise

      const playButtons = document.querySelectorAll(
        'music-button[icon-name="play"]'
      );

      const mainPlayButton = playButtons[playButtons.length - 1] as HTMLElement;

      mainPlayButton.click();

      const observer = new MutationObserver((mutations, observerInstance) => {
        if (mainPlayButton.getAttribute('icon-name') === 'pause') {
          setTimeout(() => {
            mainPlayButton.click();
          }, 100);

          observerInstance.disconnect();
          resolve(void 0);
        }
      });

      observer.observe(mainPlayButton, {
        attributes: true,
        attributeFilter: ['aria-label']
      });
    });
  }

  private _createStartTrackAction(trackId: string, albumId: string) {
    return {
      payload: {
        type: 'InteractionInterface.v1_0.InvokeHttpSkillMethod',
        payload: {
          interface: 'InteractionInterface.v1_0.InvokeHttpSkillMethod',
          url: `https://na.mesk.skill.music.a2z.com/api/playCatalogAlbum?id=${albumId}&at=${trackId}&userHash=%7B%22level%22%3A%22HD_MEMBER%22%7D`,
          clientInformation: [],
          before: [],
          after: [],
          onSuccess: [],
          onError: [],
          queue: {
            interface: 'QueuesInterface.v1_0.SingleThreadedQueue',
            id: 'ST_HTTP'
          },
          forced: true,
          owner: this.getStore().getState().TemplateStack.currentTemplate.id
        }
      },
      type: 'EXECUTE_METHOD'
    };
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
    return (window as any).__REDUX_STORES__.find(
      (store) => store.name === SKYFIRE_STORE_NAME
    );
  }
}
