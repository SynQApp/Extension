import type { PlayerState, SongInfo } from '~types/PlayerState';
import type { RepeatMode } from '~types/RepeatMode';
import { onDocumentReady } from '~util/onDocumentReady';

import type { IController } from './IController';

export enum YouTubeMusicPlayerState {
  UNSTARTED = -1,
  ENDED = 0,
  PLAYING = 1,
  PAUSED = 2,
  BUFFERING = 3,
  CUED = 5
}

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

  public play(): void {
    this._player.playVideo();
  }

  public playPause(): void {
    if (this._player.getPlayerState() === YouTubeMusicPlayerState.PLAYING) {
      this.pause();
    } else {
      this.play();
    }
  }

  public pause(): void {
    this._player.pauseVideo();
  }

  public next(): void {
    this._player.nextVideo();
  }

  public previous(): void {
    this._player.previousVideo();
  }

  // TODO: Implement
  public setRepeatMode(repeatMode: RepeatMode): void {
    throw new Error('Method not implemented.');
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
    this._player.setVolume(volume);
  }

  public seekTo(time: number): void {
    this._player.seekTo(time);
  }

  /**
   * EXAMPLE IDs:
   * - DZhNgVyIrHw
   * - lYBUbBu4W08
   */
  public async startTrack(trackId: string): Promise<void> {
    if (!this._navigationRequestInstance) {
      throw new Error('No navigation request instance');
    }

    const navigationRequest = this._createNavigationRequestInstance(trackId);

    // Trigger the event
    this._ytmApp.navigator_.navigate(navigationRequest);
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
  public isReady(): boolean {
    throw new Error('Method not implemented.');
  }

  private _createNavigationRequestInstance(trackId: string): any {
    // Clone the navigation request instance
    const navigationRequest = Object.assign(
      Object.create(Object.getPrototypeOf(this._navigationRequestInstance)),
      this._navigationRequestInstance
    );

    navigationRequest.data = {
      videoId: trackId,
      watchEndpointMusicSupportedConfigs: {
        watchEndpointMusicConfig: {
          musicVideoType: 'MUSIC_VIDEO_TYPE_ATV'
        }
      }
    };

    return navigationRequest;
  }

  /**
   * Forces app the capture a navigation request so we can clone it later. This
   * is necessary when the user hasn't already clicked on a song and we want to
   * take programmatic control of the page.
   *
   * TODO: Add screenshot "curtain" to hide the navigation
   */
  private async _forceCaptureNavigationRequest() {
    return new Promise((resolve) => {
      this._shouldPlayOnNavigation = false;
      this._ytmApp.navigate_('FEmusic_explore');

      const popstateHandler = () => {
        window.removeEventListener('popstate', popstateHandler);
        onDocumentReady(() => {
          resolve(void 0);
        });
      };

      const intervalHandler = () => {
        if (location.pathname !== '/explore') {
          return;
        }

        const item = document
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
