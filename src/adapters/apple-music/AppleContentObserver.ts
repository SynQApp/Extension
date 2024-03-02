import type { ContentObserver } from '~core/adapter';
import { sendToBackground } from '~core/messaging';
import type { ReconnectingHub } from '~core/messaging/hub';
import {
  updateMusicServiceTabCurrentTrack,
  updateMusicServiceTabPlayerState
} from '~store/slices/musicServiceTabs';
import { dispatchFromContent } from '~util/store';

import type { AppleContentController } from './AppleContentController';

const playbackStateChangedEvents = [
  'playbackStateDidChange',
  'playbackTimeDidChange',
  'playbackDurationDidChange',
  'playbackProgressDidChange',
  'playbackVolumeDidChange',
  'repeatModeDidChange'
];

export class AppleObserver implements ContentObserver {
  private _nowPlayingItemDidChangeHandler!: () => void;
  private _playbackStateChangeHandler!: () => void;

  public constructor(
    private _controller: AppleContentController,
    private _hub: ReconnectingHub
  ) {}

  public observe(): void {
    const interval = setInterval(() => {
      if (this._controller.getPlayer()) {
        clearInterval(interval);

        /**
         * Create the handlers here so that we can remove it later.
         * Needs to be wrapped this way so that we can use `this`.
         */
        this._nowPlayingItemDidChangeHandler = async () => {
          await this._handleTrackUpdated();
        };

        this._playbackStateChangeHandler = async () => {
          await this._handlePlaybackUpdated();
        };

        /**
         * Add the event listeners.
         */
        this._controller
          .getPlayer()
          .addEventListener(
            'nowPlayingItemDidChange',
            this._nowPlayingItemDidChangeHandler
          );

        playbackStateChangedEvents.forEach((event) => {
          this._controller
            .getPlayer()
            .addEventListener(event, this._playbackStateChangeHandler);
        });
      }
    }, 500);
  }

  private async _handleTrackUpdated(): Promise<void> {
    const currentTrack = this._controller.getCurrentTrack();

    const tab = await sendToBackground<undefined, chrome.tabs.Tab>({
      name: 'GET_SELF_TAB'
    });

    dispatchFromContent(
      updateMusicServiceTabCurrentTrack({
        tabId: tab.id!,
        currentTrack: currentTrack ?? undefined
      })
    );
  }

  private async _handlePlaybackUpdated(): Promise<void> {
    const playerState = this._controller.getPlayerState();

    const tab = await sendToBackground<undefined, chrome.tabs.Tab>({
      name: 'GET_SELF_TAB'
    });

    dispatchFromContent(
      updateMusicServiceTabPlayerState({
        tabId: tab.id!,
        playerState: playerState ?? undefined
      })
    );
  }
}
