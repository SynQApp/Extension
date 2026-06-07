import type {
  AlbumLinkDetails,
  ArtistLinkDetails,
  ContentController
} from '~core/adapter';
import type { TrackLinkDetails } from '~core/adapter';
import { RepeatMode } from '~types';
import type { PlaybackState, QueueItem, Track } from '~types';
import { debounce } from '~util/debounce';
import { lengthTextToSeconds } from '~util/time';
import { normalizeVolume } from '~util/volume';

import { SELECTORS } from './constants';

const REPEAT_UI_MAP: Record<string, RepeatMode> = {
  'Enable repeat': RepeatMode.NO_REPEAT,
  'Enable repeat one': RepeatMode.REPEAT_ALL,
  'Disable repeat': RepeatMode.REPEAT_ONE
};

/**
 * Spotify locked down the web API token (see auth.ts history), so this
 * controller drives playback entirely through the web player's UI: clicking
 * the on-screen controls and reading state from the DOM. This mirrors the
 * approach used by the other UI-based adapters (e.g. Amazon Music).
 */
export class SpotifyContentController implements ContentController {
  // Tracks whether *we* opened the queue panel (vs. the user already having it
  // open), so closeQueue only closes a panel we were responsible for opening.
  private _openedQueueForPopup = false;

  public play(): void {
    const playPauseButton = this._getElement<HTMLButtonElement>(
      SELECTORS.playPauseButton
    );

    // The play/pause button is a toggle, so only click it if we're paused.
    if (playPauseButton?.getAttribute('aria-label') === 'Play') {
      playPauseButton.click();
    }
  }

  public pause(): void {
    const playPauseButton = this._getElement<HTMLButtonElement>(
      SELECTORS.playPauseButton
    );

    // The play/pause button is a toggle, so only click it if we're playing.
    if (playPauseButton?.getAttribute('aria-label') === 'Pause') {
      playPauseButton.click();
    }
  }

  public playPause(): void {
    this._getElement<HTMLButtonElement>(SELECTORS.playPauseButton)?.click();
  }

  public next(): void {
    this._getElement<HTMLButtonElement>(SELECTORS.nextButton)?.click();
  }

  public previous(): void {
    // Spotify's own skip-back button restarts the track if it's past the first
    // few seconds and otherwise goes to the previous track, which matches the
    // behaviour we want, so a single click is enough.
    this._getElement<HTMLButtonElement>(SELECTORS.previousButton)?.click();
  }

  public toggleRepeatMode(): void {
    this._getElement<HTMLButtonElement>(SELECTORS.repeatButton)?.click();
  }

  public toggleLike(): void {
    this._getElement<HTMLButtonElement>(SELECTORS.likeButton)?.click();
  }

  /**
   * Spotify doesn't have a dislike feature, so this is a no-op.
   */
  public toggleDislike(): void {
    return;
  }

  public toggleMute(): void {
    this._getElement<HTMLButtonElement>(SELECTORS.muteButton)?.click();
  }

  public setVolume(volume: number, relative?: boolean): void {
    if (relative) {
      volume = this._getVolume() + volume;
    }

    volume = normalizeVolume(volume);

    debounce(
      () => {
        const volumeInput = this._getVolumeInput();

        if (!volumeInput) {
          return;
        }

        // The volume slider is a [0, 1] range input.
        this._setRangeInputValue(volumeInput, volume / 100);
      },
      'spotify:setVolume',
      25
    );
  }

  public seekTo(time: number): void {
    debounce(
      () => {
        const progressInput = this._getProgressInput();

        if (!progressInput) {
          return;
        }

        // The progress slider is a range input measured in milliseconds.
        this._setRangeInputValue(progressInput, time * 1000);
      },
      'spotify:seekTo',
      25
    );
  }

  public getPlayerState(): PlaybackState | null {
    const progressInput = this._getProgressInput();

    if (!progressInput) {
      return null;
    }

    // Prefer the on-screen position text (e.g. "0:34"), which Spotify updates
    // every second, and fall back to the range input's value (in ms).
    const positionText = this._getElement<HTMLElement>(
      SELECTORS.playbackPosition
    )?.innerText;

    let currentTime: number;

    if (positionText) {
      currentTime = lengthTextToSeconds(positionText);
    } else {
      const currentTimeValue = progressInput.getAttribute('value');

      if (!currentTimeValue) {
        return null;
      }

      currentTime = Math.round(parseInt(currentTimeValue) / 1000);
    }

    const playPauseButton = this._getElement<HTMLButtonElement>(
      SELECTORS.playPauseButton
    );
    // The aria-label is "Play" when paused and "Pause" when playing.
    const isPlaying = playPauseButton?.getAttribute('aria-label') === 'Pause';

    const repeatButton = this._getElement<HTMLButtonElement>(
      SELECTORS.repeatButton
    );
    const repeatText = repeatButton?.getAttribute('aria-label');
    const repeatMode = repeatText
      ? REPEAT_UI_MAP[repeatText] ?? RepeatMode.NO_REPEAT
      : RepeatMode.NO_REPEAT;

    return {
      currentTime,
      isPlaying,
      repeatMode,
      volume: this._getVolume(),
      queue: this.getQueue()
    };
  }

  public getCurrentTrack(): Track | null {
    const name = this._getElement<HTMLElement>(SELECTORS.trackTitle)?.innerText;

    let artistElements = this._getElements<HTMLElement>(SELECTORS.trackArtist);

    if (!artistElements.length) {
      artistElements = this._getElements<HTMLElement>(SELECTORS.trackShow);
    }

    const artistName = artistElements
      .map((element) => element.innerText)
      .join(', ');

    const albumCoverUrl = this._getElement<HTMLImageElement>(
      SELECTORS.coverArt
    )?.src;

    const progressInput = this._getProgressInput();
    const duration = progressInput
      ? Math.round(parseInt(progressInput.getAttribute('max') ?? '0') / 1000)
      : 0;

    if (!name) {
      return null;
    }

    return {
      // The web player UI doesn't expose the track ID, so we leave it blank.
      id: '',
      name,
      artistName,
      albumName: '',
      albumCoverUrl: albumCoverUrl ?? '',
      duration,
      isLiked: this._isCurrentTrackLiked(),
      type: this._getElements(SELECTORS.trackShow).length ? 'podcast' : 'song'
    };
  }

  /**
   * Spotify only renders the queue panel (`aside[aria-label="Queue"]`) while the
   * user has it open. When it's open we parse the full "Now playing" + "Next up"
   * list; otherwise we fall back to reporting just the currently-playing track so
   * downstream consumers always have something to show.
   */
  public getQueue(): QueueItem[] {
    const queuePanel = this._getElement(SELECTORS.queuePanel);

    if (!queuePanel) {
      const currentTrack = this.getCurrentTrack();

      return currentTrack ? [{ track: currentTrack, isPlaying: true }] : [];
    }

    const rows = Array.from(
      queuePanel.querySelectorAll<HTMLElement>(SELECTORS.queueRow)
    );

    return rows
      .map((row) => this._parseQueueRow(row))
      .filter((item): item is QueueItem => item !== null);
  }

  /**
   * Each queue row sits inside a wrapper carrying a stable `data-flip-id`, which
   * we surface as the track ID. To play a queue item we find the row with the
   * matching flip ID and click its play button, falling back to restarting the
   * current track when it's the one requested.
   */
  public playQueueTrack(id: string): void {
    const queuePanel = this._getElement(SELECTORS.queuePanel);

    if (queuePanel && id) {
      const wrapper = queuePanel.querySelector<HTMLElement>(
        `[data-flip-id="${CSS.escape(id)}"]`
      );
      const playButton = wrapper?.querySelector<HTMLButtonElement>(
        SELECTORS.queueRowPlayButton
      );

      if (playButton) {
        playButton.click();
        return;
      }
    }

    const currentTrack = this.getCurrentTrack();

    if (currentTrack && currentTrack.id === id) {
      this.seekTo(0);
    }
  }

  /**
   * Reading the full queue requires the queue panel to be visible, so we open it
   * when the popup opens. We remember whether the user already had it open so
   * closeQueue can leave their view untouched. Clicking the queue button (which
   * lives in the now-playing bar) flips its aria-checked, which the playback
   * observer already watches, so the freshly-visible queue is re-read for us.
   */
  public openQueue(): void {
    if (this._isQueueOpen()) {
      // The user already had the queue open; don't take ownership of closing it.
      this._openedQueueForPopup = false;
      return;
    }

    this._getElement<HTMLButtonElement>(SELECTORS.queueButton)?.click();
    this._openedQueueForPopup = true;
  }

  /**
   * Close the queue panel, but only if we were the ones who opened it for the
   * popup; if the user already had it open we leave it as-is.
   */
  public closeQueue(): void {
    if (!this._openedQueueForPopup) {
      return;
    }

    this._openedQueueForPopup = false;

    if (this._isQueueOpen()) {
      this._getElement<HTMLButtonElement>(SELECTORS.queueButton)?.click();
    }
  }

  private _isQueueOpen(): boolean {
    return Boolean(this._getElement(SELECTORS.queuePanel));
  }

  private _parseQueueRow(row: HTMLElement): QueueItem | null {
    const titleElement = row.querySelector<HTMLElement>(SELECTORS.queueRowTitle);
    const name = titleElement?.innerText.trim();

    if (!name) {
      return null;
    }

    const subtitle = row.querySelector<HTMLElement>(SELECTORS.queueRowSubtitle);
    const artistLinks = subtitle
      ? Array.from(subtitle.querySelectorAll<HTMLElement>('a'))
      : [];
    const artistName = artistLinks.length
      ? artistLinks.map((link) => link.innerText.trim()).join(', ')
      : subtitle?.innerText.trim() ?? '';

    const image = row.querySelector<HTMLImageElement>(SELECTORS.queueRowImage);
    const albumCoverUrl = image?.src ?? '';

    // The currently-playing row's play button toggles to a "Pause ..." label.
    const playButton = row.querySelector<HTMLButtonElement>(
      SELECTORS.queueRowPlayButton
    );
    const isPlaying =
      playButton?.getAttribute('aria-label')?.startsWith('Pause') ?? false;

    // The row is wrapped by an element carrying a stable per-row `data-flip-id`,
    // which is the closest thing the queue UI offers to a track identifier.
    const id =
      row.closest<HTMLElement>('[data-flip-id]')?.dataset.flipId ?? '';

    return {
      track: {
        id,
        name,
        artistName,
        albumName: '',
        albumCoverUrl,
        duration: 0,
        type: 'song'
      },
      isPlaying
    };
  }

  public getTrackLinkDetails(): TrackLinkDetails | null {
    // Spotify removed the og:* meta tags, so we read the detail-page header DOM
    // instead. This describes the page being viewed regardless of playback.
    const header = this._getEntityHeader();
    const name = this._getElement<HTMLElement>(
      SELECTORS.entityTitle
    )?.innerText.trim();

    if (!header || !name) {
      return null;
    }

    return {
      name,
      artistName: this._getHeaderArtists(header),
      albumName:
        header
          .querySelector<HTMLAnchorElement>(SELECTORS.headerAlbumLink)
          ?.innerText.trim() ?? '',
      albumCoverUrl: this._getHeaderCoverUrl(header),
      duration: this._getHeaderDuration(header)
    };
  }

  public getAlbumLinkDetails(): AlbumLinkDetails | null {
    // On an album page the entity title is the album name.
    const header = this._getEntityHeader();
    const name = this._getElement<HTMLElement>(
      SELECTORS.entityTitle
    )?.innerText.trim();

    if (!header || !name) {
      return null;
    }

    return {
      name,
      artistName: this._getHeaderArtists(header),
      albumCoverUrl: this._getHeaderCoverUrl(header)
    };
  }

  public getArtistLinkDetails(): ArtistLinkDetails | null {
    // The artist page uses a different (adaptive) title element and has no
    // artist image in the header, so we only report the name.
    const name = this._getElement<HTMLElement>(
      SELECTORS.artistEntityTitle
    )?.innerText.trim();

    if (!name) {
      return null;
    }

    return {
      name
    };
  }

  /**
   * Returns the detail-page header container (the block holding the cover art,
   * title, and subtitle row). Anchored on the entity title since the
   * surrounding class names are obfuscated and unstable.
   */
  private _getEntityHeader(): HTMLElement | null {
    const title = this._getElement<HTMLElement>(SELECTORS.entityTitle);

    // title -> wrapping <span> -> header metadata container.
    return title?.parentElement?.parentElement ?? null;
  }

  private _getHeaderArtists(header: HTMLElement): string {
    return Array.from(
      header.querySelectorAll<HTMLElement>(SELECTORS.creatorLink)
    )
      .map((link) => link.innerText.trim())
      .filter(Boolean)
      .join(', ');
  }

  private _getHeaderCoverUrl(header: HTMLElement): string {
    // The cover art is the only image with a srcset in the header (the small
    // artist avatar in the subtitle uses a plain src).
    return (
      header.parentElement?.querySelector<HTMLImageElement>('img[srcset]')
        ?.src ?? ''
    );
  }

  private _getHeaderDuration(header: HTMLElement): number {
    // The duration span in the subtitle row has no testid, so find the one whose
    // text looks like a timestamp (e.g. "5:54"). Returned in milliseconds to
    // match the redirect matcher's expected unit.
    const durationText = Array.from(
      header.querySelectorAll<HTMLElement>('span')
    )
      .map((span) => span.innerText.trim())
      .find((text) => /^\d{1,2}:\d{2}$/.test(text));

    return durationText ? lengthTextToSeconds(durationText) * 1000 : 0;
  }

  private _isCurrentTrackLiked(): boolean {
    const likeButton = this._getElement<HTMLButtonElement>(SELECTORS.likeButton);

    if (!likeButton) {
      return false;
    }

    return likeButton.getAttribute('aria-checked') === 'true';
  }

  private _getVolume(): number {
    const volumeInput = this._getVolumeInput();

    if (!volumeInput) {
      return 50;
    }

    // The volume slider is a [0, 1] range input.
    return parseFloat(volumeInput.value) * 100;
  }

  private _getVolumeInput(): HTMLInputElement | null {
    return (
      this._getElement(SELECTORS.volumeBar)?.querySelector(
        'input[type="range"]'
      ) ?? null
    );
  }

  private _getProgressInput(): HTMLInputElement | null {
    return (
      this._getElement(SELECTORS.progressBar)?.querySelector(
        'input[type="range"]'
      ) ?? null
    );
  }

  /**
   * Spotify's sliders are React-controlled range inputs. To change them we have
   * to set the value through the native setter and then dispatch input/change
   * events so React picks up the change.
   */
  private _setRangeInputValue(input: HTMLInputElement, value: number): void {
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype,
      'value'
    )?.set;

    nativeInputValueSetter?.call(input, value.toString());

    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
  }

  private _getElement<T extends Element>(selector: string): T | null {
    return document.querySelector<T>(selector);
  }

  private _getElements<T extends Element>(selector: string): T[] {
    return Array.from(document.querySelectorAll<T>(selector));
  }
}
