import { NotReadyReason } from '~types/NotReadyReason';
import type { PlayerState, SongInfo } from '~types/PlayerState';
import { RepeatMode } from '~types/RepeatMode';
import type { ValueOrPromise } from '~types/Util';
import { mainWorldToBackground } from '~util/mainWorldToBackground';
import { onDocumentReady } from '~util/onDocumentReady';
import { lengthTextToSeconds } from '~util/time';

import type { IController } from './IController';

declare let window: Window & {
  yt: any;
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

  private _curtain: HTMLDivElement;

  constructor() {
    this._createNavigationWrapper();
    this._addCurtainStyles();
  }

  public async prepareForSession() {
    if (!this._navigationRequestInstance) {
      await this._forceCaptureNavigationRequest();
    }

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
        '.ytmusic-like-button-renderer.like'
      ) as HTMLElement
    ).click();
  }

  public toggleDislike(): void {
    // Simulate a click on the dislike button
    (
      document.querySelector(
        '.ytmusic-like-button-renderer.dislike'
      ) as HTMLElement
    ).click();
  }

  public setVolume(volume: number): void {
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

  public getPlayerState(): PlayerState | undefined {
    if (this._ytmApp.playerUiState_ === 'INACTIVE') {
      return undefined;
    }

    const repeatButton = document.querySelector('.repeat.ytmusic-player-bar');
    const repeatMode =
      REPEAT_STATES_MAP[repeatButton?.getAttribute('aria-label')];

    return {
      currentTime: Math.round(this.getPlayer().getCurrentTime()),
      isPlaying:
        this.getPlayer().getPlayerState() === YouTubeMusicPlayerState.PLAYING,
      volume: this.getPlayer().getVolume(),
      repeatMode
    };
  }

  public getCurrentSongInfo(): ValueOrPromise<SongInfo> {
    const videoDetails = this._appState.player?.playerResponse?.videoDetails;
    const trackId = videoDetails.videoId;

    const queueItem = this._appState.queue.items.find((queueItem) => {
      const rendererData = this._getQueueItemRendererData(queueItem);

      return rendererData?.videoId === trackId;
    });

    const songInfo: SongInfo = this._queueItemToSongInfo(queueItem);

    return songInfo;
  }

  public getQueue(): SongInfo[] {
    return this._appState.queue.items.map((queueItem) =>
      this._queueItemToSongInfo(queueItem)
    );
  }

  public isReady(): true | NotReadyReason {
    if (!window.yt.config_.IS_SUBSCRIBER) {
      return NotReadyReason.NON_PREMIUM_USER;
    }

    if (!this._navigationRequestInstance) {
      return NotReadyReason.NOT_CONTROLLABLE;
    }

    return true;
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

  private _getQueueItemRendererData(queueItem: any): any {
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

  private _selectAlbumCoverUrl(thumbnails: any[]): string {
    return thumbnails.find((thumbnail) => thumbnail.width >= 100).url;
  }

  private _queueItemToSongInfo(queueItem: any): SongInfo {
    const rendererData = this._getQueueItemRendererData(queueItem);

    const trackId = rendererData.videoId;
    const trackName = rendererData.title.runs[0].text;
    const { artist, album } = this._longBylineToArtistAlbum(
      rendererData.longBylineText.runs
    );
    const albumCoverUrl = this._selectAlbumCoverUrl(
      rendererData.thumbnail.thumbnails
    );

    return {
      duration: lengthTextToSeconds(rendererData.lengthText.runs[0].text),
      trackId,
      trackName,
      artistName: artist,
      albumName: album,
      albumCoverUrl
    };
  }

  /**
   * Forces app the capture a navigation request so we can clone it later. This
   * is necessary when the user hasn't already clicked on a song and we want to
   * take programmatic control of the page.
   */
  private async _forceCaptureNavigationRequest() {
    return new Promise(async (resolve) => {
      await this._addCurtain();

      this._shouldPlayOnNavigation = false;
      this._ytmApp.navigate_('FEmusic_explore');

      const popstateHandler = () => {
        window.removeEventListener('popstate', popstateHandler);
        onDocumentReady(() => {
          this._removeCurtain();
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

  private async _addCurtain() {
    const screenshot = await mainWorldToBackground({ name: 'SCREENSHOT' });

    this._curtain = document.createElement('div');
    this._curtain.className = 'synq-curtain';

    // create image element that overlays full screen with screenshot
    const img = document.createElement('img');
    img.src = screenshot;

    // add spinner on top of the image
    const spinner = document.createElement('div');
    spinner.className = 'synq-curtain-spinner';

    this._curtain.appendChild(img);
    this._curtain.appendChild(spinner);

    document.body.appendChild(this._curtain);
  }

  private _removeCurtain() {
    this._curtain.remove();
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

  private _addCurtainStyles() {
    const curtainStyle = document.createElement('style');
    curtainStyle.innerText = `
@keyframes spin {
  0% {
    transform: translate(-50%, -50%) rotate(0deg);
  }

  100% {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}

.synq-curtain {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 100;
}

.synq-curtain img {
  width: 100%;
  height: 100%;
  pointer-events: none;
  filter: blur(5px);
}

.synq-curtain .synq-curtain-spinner {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 100;
  pointer-events: none;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 5px solid #fff;
  border-top: 5px solid #000;
  animation: spin 1s linear infinite;
}
    `;
    document.head.appendChild(curtainStyle);
  }

  public getPlayer() {
    return document.getElementById('movie_player') as any;
  }

  private get _ytmApp() {
    return document.getElementsByTagName('ytmusic-app')?.[0] as any;
  }

  private get _appState() {
    return this._ytmApp.store.getState() as any;
  }
}
