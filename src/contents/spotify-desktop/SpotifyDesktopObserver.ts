import { MusicServiceObserver } from '~contents/lib/MusicServiceObserver';
import { store } from '~store';
import {
  updateMusicServiceTab,
  updateMusicServiceTabCurrentTrack,
  updateMusicServiceTabPlayerState
} from '~store/slices/musicServiceTabs';
import {
  MusicService,
  type MusicServiceTab,
  type ValueOrPromise
} from '~types';
import type { ReduxHub } from '~util/connectToReduxHub';

import type { SpotifyDesktopController } from './SpotifyDesktopController';

export class SpotifyDesktopObserver extends MusicServiceObserver {
  private _player: Spotify.Player;
  private _dispatch: typeof store.dispatch;
  _controller: SpotifyDesktopController;

  constructor(
    player: Spotify.Player,
    controller: SpotifyDesktopController,
    hub: ReduxHub,
    dispatch: typeof store.dispatch
  ) {
    super(controller, hub);

    this._player = player;
    this._controller = controller;
    this._hub = hub;
    this._dispatch = dispatch;
  }

  public async observe(): Promise<void> {
    const tab = await this._hub.asyncPostMessage<chrome.tabs.Tab>({
      name: 'GET_SELF_TAB'
    });

    const musicServiceTab: MusicServiceTab = {
      tabId: tab.id!,
      musicService: MusicService.SPOTIFY,
      currentTrack: null
    };

    this._dispatch(updateMusicServiceTab(musicServiceTab));

    let counter = 0;
    let counterInterval: number | null = null;

    this._player.addListener('player_state_changed', async (state) => {
      this._controller.clearPlayerStateCache();

      const currentTrack = await this._controller.getCurrentTrack();
      const playerState = await this._controller.getPlayerState(true, state);

      if (currentTrack) {
        this._dispatch(
          updateMusicServiceTabCurrentTrack({
            tabId: tab.id!,
            currentTrack
          })
        );
      }

      if (playerState) {
        this._dispatch(
          updateMusicServiceTab({
            tabId: tab.id!,
            musicService: MusicService.SPOTIFY,
            currentTrack,
            playerState
          })
        );
      }

      if (counterInterval) {
        counter = 0;
        clearInterval(counterInterval);
      }

      counterInterval = window.setInterval(async () => {
        const playerState = await this._controller.getPlayerState(false);

        if (playerState) {
          this._dispatch(
            updateMusicServiceTabPlayerState({
              tabId: tab.id!,
              playerState
            })
          );
        }
      }, 1000);
    });
  }

  public unobserve(): ValueOrPromise<void> {
    throw new Error('Method not implemented.');
  }
}
