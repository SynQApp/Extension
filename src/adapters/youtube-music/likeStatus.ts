/**
 * YouTube Music exposes the current like/dislike state through `aria-pressed`,
 * but it has moved that attribute between the `#button-shape-*` wrapper and the
 * inner `<button>` across releases.
 *
 * Reading it from a single fixed node means that after such a change
 * `getAttribute('aria-pressed')` returns `null`, which compares unequal to
 * `'true'` and is therefore silently reported as "not pressed". The result is
 * that the toggle buttons keep working (they click the inner `<button>`) while
 * the state SynQ displays is always "neither liked nor disliked".
 *
 * These helpers resolve the state from whichever node currently carries it and
 * expose the relevant nodes so the observer watches the same places the reader
 * looks at.
 */

export const LIKE_BUTTON_SELECTOR = '.ytmusic-player-bar #button-shape-like';
export const DISLIKE_BUTTON_SELECTOR =
  '.ytmusic-player-bar #button-shape-dislike';
export const LIKE_RENDERER_SELECTOR =
  '.ytmusic-player-bar ytmusic-like-button-renderer';
export const PLAYER_BAR_SELECTOR = 'ytmusic-player-bar';

const ARIA_PRESSED_ATTRIBUTE = 'aria-pressed';

/**
 * `ytmusic-like-button-renderer` mirrors the button state on itself as
 * `like-status`, using the values below. This is used as a fallback when
 * neither button exposes `aria-pressed`.
 */
const LIKE_STATUS_ATTRIBUTE = 'like-status';
const LIKE_STATUS_LIKE = 'LIKE';
const LIKE_STATUS_DISLIKE = 'DISLIKE';

/**
 * Attributes that indicate a like/dislike change, for `MutationObserver`.
 */
export const LIKE_STATE_ATTRIBUTE_FILTER = [
  ARIA_PRESSED_ATTRIBUTE,
  LIKE_STATUS_ATTRIBUTE
];

export interface LikeState {
  isLiked: boolean;
  isDisliked: boolean;
}

const queryLikeButton = () => document.querySelector(LIKE_BUTTON_SELECTOR);

const queryDislikeButton = () =>
  document.querySelector(DISLIKE_BUTTON_SELECTOR);

const queryLikeRenderer = () => document.querySelector(LIKE_RENDERER_SELECTOR);

/**
 * Resolves the element that should receive a click. YouTube Music renders an
 * inner `<button>` inside the `#button-shape-*` wrapper; clicking the wrapper
 * itself is the fallback if that inner button is ever removed.
 */
const resolveClickTarget = (wrapper: Element | null): HTMLElement | null => {
  if (!wrapper) {
    return null;
  }

  return (wrapper.querySelector('button') ?? wrapper) as HTMLElement;
};

export const getLikeButtonTarget = (): HTMLElement | null =>
  resolveClickTarget(queryLikeButton());

export const getDislikeButtonTarget = (): HTMLElement | null =>
  resolveClickTarget(queryDislikeButton());

/**
 * Reads `aria-pressed` from `wrapper` itself or from a descendant that carries
 * it.
 *
 * Returns `null` when the attribute is absent entirely, so that callers can
 * distinguish "explicitly not pressed" from "could not determine" and fall back
 * to another source instead of defaulting to `false`.
 */
const readAriaPressed = (wrapper: Element | null): boolean | null => {
  if (!wrapper) {
    return null;
  }

  const node = wrapper.hasAttribute(ARIA_PRESSED_ATTRIBUTE)
    ? wrapper
    : wrapper.querySelector(`[${ARIA_PRESSED_ATTRIBUTE}]`);

  const value = node?.getAttribute(ARIA_PRESSED_ATTRIBUTE);

  if (value === null || value === undefined) {
    return null;
  }

  return value === 'true';
};

/**
 * Returns the current like/dislike state of the track in the player bar.
 */
export const readLikeState = (): LikeState => {
  const isLiked = readAriaPressed(queryLikeButton());
  const isDisliked = readAriaPressed(queryDislikeButton());

  if (isLiked !== null || isDisliked !== null) {
    return {
      isLiked: isLiked === true,
      isDisliked: isDisliked === true
    };
  }

  const likeStatus = queryLikeRenderer()?.getAttribute(LIKE_STATUS_ATTRIBUTE);

  return {
    isLiked: likeStatus === LIKE_STATUS_LIKE,
    isDisliked: likeStatus === LIKE_STATUS_DISLIKE
  };
};

/**
 * Nodes to observe for like/dislike changes. Observing each of these with
 * `subtree: true` covers the attribute living on the wrapper, on the inner
 * `<button>`, or on the renderer.
 *
 * Falls back to the player bar so that a future markup change still produces
 * mutations rather than silently going quiet.
 */
export const getLikeStateObserverTargets = (): Element[] => {
  const targets = [
    queryLikeRenderer(),
    queryLikeButton(),
    queryDislikeButton()
  ].filter((node): node is Element => node !== null);

  if (targets.length > 0) {
    return targets;
  }

  const playerBar = document.querySelector(PLAYER_BAR_SELECTOR);

  return playerBar ? [playerBar] : [];
};
