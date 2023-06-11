import type { Store } from 'redux';

import { NotReadyReason } from '~types/NotReadyReason';
import type { PlayerState, SongInfo } from '~types/PlayerState';
import { RepeatMode } from '~types/RepeatMode';

import type { IController } from './IController';

declare let window: Window & {
  __REDUX_STORES__: (Store & { name: string })[];
  amznMusic: any;
  maestro: any;
};

const SKYFIRE_STORE_NAME = 'DMWebPlayerSkyfire';

const REPEAT_MAP: Record<RepeatMode, string> = {
  [RepeatMode.NO_REPEAT]: 'PlaybackInterface.v1_0.RepeatOffMethod',
  [RepeatMode.REPEAT_ONE]: 'PlaybackInterface.v1_0.RepeatOneMethod',
  [RepeatMode.REPEAT_ALL]: 'PlaybackInterface.v1_0.RepeatAllMethod'
};

/**
 * In general, the strategy for controlling Amazon Music is to use the DMWebPlayerSkyfire
 * Redux store we exposed in the amazon-music-redux-init content script. Then we can
 * dispatch actions to the store to control playback.
 */
export class AmazonMusicController implements IController {
  private get _skyfireStore() {
    return (window as any).__REDUX_STORES__.find(
      (store) => store.name === SKYFIRE_STORE_NAME
    );
  }

  public play(): void {
    this._skyfireStore.dispatch({
      type: 'PlaybackInterface.v1_0.ResumeMediaMethod',
      payload: {}
    });
  }

  public playPause(): void {
    if (this._skyfireStore.getState().PlaybackStates.play.state === 'PAUSED') {
      this.play();
    } else {
      this.pause();
    }
  }

  public pause(): void {
    this._skyfireStore.dispatch({
      type: 'PlaybackInterface.v1_0.PauseMediaMethod'
    });
  }

  public next(): void {
    this._skyfireStore.dispatch({
      type: 'PlaybackInterface.v1_0.PlayNextMediaMethod',
      payload: {}
    });
  }

  public previous(): void {
    this._skyfireStore.dispatch({
      type: 'PlaybackInterface.v1_0.PlayPreviousMediaMethod',
      payload: {}
    });
  }

  public setRepeatMode(repeatMode: RepeatMode): void {
    this._skyfireStore.dispatch({
      type: REPEAT_MAP[repeatMode]
    });
  }

  // TODO: Implement
  public toggleLike(): void {
    throw new Error('Method not implemented.');
  }

  // TODO: Implement
  public toggleDislike(): void {
    throw new Error('Method not implemented.');
  }

  public setVolume(volume: number): void {
    this._skyfireStore.dispatch({
      type: 'PlaybackInterface.v1_0.SetVolumeMethod',
      payload: {
        volume: volume / 100
      }
    });
  }

  public seekTo(time: number): void {
    this._skyfireStore.dispatch({
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
    this._skyfireStore.dispatch(playTrackAction);
  }

  public prepareForSession(): Promise<void> {
    return;
  }

  // TODO: Implement
  public getPlayerState(): Promise<PlayerState> {
    throw new Error('Method not implemented.');
  }

  // TODO: Implement
  public getQueue(): Promise<SongInfo[]> {
    throw new Error('Method not implemented.');
  }

  // TODO: Implement
  public isReady(): true | NotReadyReason {
    throw new Error('Method not implemented.');
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
          owner: this._skyfireStore.getState().TemplateStack.currentTemplate.id
        }
      },
      type: 'EXECUTE_METHOD'
    };
  }
}
