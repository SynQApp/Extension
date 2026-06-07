import type { ContentObserver } from '~core/adapter';
import { updateCurrentTrack, updatePlaybackState } from '~core/player';
import { debounce } from '~util/debounce';
import { waitForElement } from '~util/waitForElement';

import type { SpotifyContentController } from './SpotifyContentController';

const NOW_PLAYING_BAR_SELECTOR = '[data-testid="now-playing-bar"]';

export class SpotifyObserver implements ContentObserver {
  constructor(private _controller: SpotifyContentController) {}

  public async observe(): Promise<void> {
    const nowPlayingBar = await waitForElement(NOW_PLAYING_BAR_SELECTOR);

    this._setupPlaybackStateObserver(nowPlayingBar);
    this._setupTrackObserver(nowPlayingBar);
  }

  /**
   * Spotify frequently re-renders the individual control buttons, so observing
   * them directly stops working once the original nodes are replaced (only the
   * persistent volume input kept updating). Instead we observe the entire
   * now-playing bar subtree, which is stable, and react to any relevant
   * attribute, text, or child change inside it.
   */
  private _setupPlaybackStateObserver(nowPlayingBar: Element): void {
    const observer = new MutationObserver(() => {
      // The position text changes ~once per second; debounce to coalesce the
      // burst of mutations each tick produces into a single update.
      debounce(
        () => this._handlePlaybackUpdated(),
        'spotify:playbackUpdated',
        200
      );
    });

    observer.observe(nowPlayingBar, {
      subtree: true,
      childList: true,
      // characterData catches the progress position text ticking each second.
      characterData: true,
      attributeFilter: ['aria-label', 'aria-checked', 'value']
    });
  }

  /**
   * Track changes swap the cover art / title / artist nodes, and liking a track
   * flips the like button's aria-label. Both happen inside the now-playing bar.
   */
  private _setupTrackObserver(nowPlayingBar: Element): void {
    const observer = new MutationObserver(() => {
      debounce(() => this._handleTrackUpdated(), 'spotify:trackUpdated', 200);
    });

    observer.observe(nowPlayingBar, {
      subtree: true,
      childList: true,
      attributeFilter: ['aria-label', 'aria-checked', 'src']
    });
  }

  private async _handleTrackUpdated(): Promise<void> {
    const currentTrack = await this._controller.getCurrentTrack();
    await updateCurrentTrack(currentTrack);
  }

  private async _handlePlaybackUpdated(): Promise<void> {
    const playerState = await this._controller.getPlayerState();
    await updatePlaybackState(playerState);
  }
}
