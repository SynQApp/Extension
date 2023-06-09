import type { RepeatMode } from '~types/RepeatMode';
import type { SynQWindow } from '~types/Window';
import { YouTubeMusicPlayerState } from '~types/YouTubeMusicPlayerState';
import { onDocumentReady } from '~util/onDocumentReady';

import type { IController } from './IController';

declare let window: SynQWindow;

const exampleIds = ['DZhNgVyIrHw', 'lYBUbBu4W08'];

export class YouTubeMusicController implements IController {
  /**
   * Reference to a NavigationRequest that we can clone for song change navigation
   */
  private _navigationRequestInstance: any;

  /**
   * Reference to interval used for session prep
   */
  private _exploreNavigationIntervalRef: any;

  /**
   * Used to control the wrapper navigation function. When false, we are in the middle of
   * forcing a navigation to the capture instance, so we don't want to play the song. When true,
   * we are navigating to the capture instance because the user clicked on a song, so we want to
   * play the song.
   */
  private _shouldPlayOnNavigation = true;

  constructor() {
    this._createNavigationWrapper();
  }

  public async prepareForSession() {
    if (!this._navigationRequestInstance) {
      await this._forceCaptureNavigationRequest();
    }

    return;
  }

  play(): void {
    this._player.playVideo();
  }

  playPause(): void {
    if (this._player.getPlayerState() === YouTubeMusicPlayerState.PLAYING) {
      this._player.pauseVideo();
    } else {
      this._player.playVideo();
    }
  }

  pause(): void {
    this._player.pauseVideo();
  }

  next(): void {
    this._player.nextVideo();
  }

  previous(): void {
    this._player.previousVideo();
  }

  setRepeatMode(repeatMode: RepeatMode): void {
    throw new Error('Method not implemented.');
  }

  toggleLike(): void {
    throw new Error('Method not implemented.');
  }

  toggleDislike(): void {
    throw new Error('Method not implemented.');
  }

  setVolume(volume: number): void {
    this._player.setVolume(volume);
  }

  seekTo(time: number): void {
    this._player.seekTo(time);
  }

  public async startTrack(trackId: string): Promise<void> {
    if (!this._navigationRequestInstance) {
      throw new Error('No navigation request instance');
    }

    // Clone the event
    let navigationRequest = Object.assign(
      Object.create(Object.getPrototypeOf(this._navigationRequestInstance)),
      this._navigationRequestInstance
    );

    // Update the event
    navigationRequest.data = {
      videoId: trackId,
      watchEndpointMusicSupportedConfigs: {
        watchEndpointMusicConfig: {
          musicVideoType: 'MUSIC_VIDEO_TYPE_ATV'
        }
      }
    };

    // Trigger the event
    this._ytmApp.navigator_.navigate(navigationRequest);
  }

  private async _forceCaptureNavigationRequest() {
    return new Promise((resolve, reject) => {
      this._shouldPlayOnNavigation = false;
      this._ytmApp.navigate_('FEmusic_explore');

      let popstateHandler = () => {
        window.removeEventListener('popstate', popstateHandler);
        onDocumentReady(() => {
          console.log('Completed');
          resolve(void 0);
        });
      };

      let intervalHandler = () => {
        if (location.pathname !== '/explore') {
          return;
        }

        let item = document
          .querySelector(
            '#items > ytmusic-responsive-list-item-renderer:nth-child(1)'
          )
          ?.querySelector('ytmusic-play-button-renderer') as HTMLElement;

        if (item) {
          clearInterval(this._exploreNavigationIntervalRef);
          item.click();

          history.back();

          window.addEventListener('popstate', popstateHandler);
        }
      };

      // Wait for the explore page to load, then click the first item
      this._exploreNavigationIntervalRef = setInterval(intervalHandler, 200);
    });
  }

  private _isMusicVideoTypeATV(navigationRequest) {
    return (
      navigationRequest?.data?.watchEndpointMusicSupportedConfigs
        ?.watchEndpointMusicConfig?.musicVideoType === 'MUSIC_VIDEO_TYPE_ATV'
    );
  }

  private _createNavigationWrapper() {
    this._ytmApp.navigator_.originalNavigate = this._ytmApp.navigator_.navigate;

    this._ytmApp.navigator_.navigate = (navigationRequest) => {
      if (this._isMusicVideoTypeATV(navigationRequest)) {
        this._navigationRequestInstance = navigationRequest;

        this._ytmApp.navigator_.navigate =
          this._ytmApp.navigator_.originalNavigate;

        if (!this._shouldPlayOnNavigation) {
          return;
        }
      }

      return this._ytmApp.navigator_.originalNavigate(navigationRequest);
    };
  }

  private get _player() {
    return document.getElementById('movie_player') as any;
  }

  private get _ytmApp() {
    return document.getElementsByTagName('ytmusic-app')?.[0] as any;
  }
}
