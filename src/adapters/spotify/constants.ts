export const SELECTORS = {
  playPauseButton: 'button[data-testid="control-button-playpause"]',
  nextButton: 'button[data-testid="control-button-skip-forward"]',
  previousButton: 'button[data-testid="control-button-skip-back"]',
  repeatButton: 'button[data-testid="control-button-repeat"]',
  muteButton: 'button[data-testid="volume-bar-toggle-mute-button"]',
  volumeBar: 'div[data-testid="volume-bar"]',
  progressBar: 'div[data-testid="playback-progressbar"]',
  playbackPosition: 'div[data-testid="playback-position"]',
  trackTitle: 'div[data-testid="context-item-info-title"]',
  trackArtist: 'a[data-testid="context-item-info-artist"]',
  trackShow: 'a[data-testid="context-item-info-show"]',
  coverArt: 'img[data-testid="cover-art-image"]',
  // The like/save button has no data-testid and its aria-label changes between
  // states ("Add to Liked Songs" when unsaved, "Add to playlist" when saved),
  // so we match the only checkbox-style button inside the now-playing widget and
  // read its saved state from aria-checked.
  likeButton: 'div[data-testid="now-playing-widget"] button[aria-checked]',
  // The queue panel only exists in the DOM while the user has it open.
  queueButton: 'button[data-testid="control-button-queue"]',
  queuePanel: 'aside[aria-label="Queue"]',
  queueRow: 'li[role="row"]',
  queueRowImage: 'img[data-testid="entity-image"]',
  queueRowPlayButton: 'button[data-testid="play-button"]',
  queueRowTitle: 'p[data-encore-id="listRowTitle"]',
  queueRowSubtitle: 'p[data-encore-id="listRowSubtitle"]',
  // Track/album/artist detail-page header. These elements live in the page
  // header (not the now-playing bar), so they describe the page being viewed
  // regardless of what's playing. Used to build redirect link details.
  entityTitle: '[data-testid="entityTitle"]',
  artistEntityTitle: '[data-testid="adaptiveEntityTitle"]',
  creatorLink: 'a[data-testid="creator-link"]',
  headerAlbumLink: 'a[href^="/album/"]'
};
