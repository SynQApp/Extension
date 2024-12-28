import SpotifyLogo from 'data-base64:~assets/images/spotify-logo.svg';

import type { ContentController, MusicServiceAdapter } from '~core/adapter';
import { MUSIC_SERVICE } from '~types';

import { SpotifyBackgroundController } from './SpotifyBackgroundController';
import { SpotifyContentController } from './SpotifyContentController';
import { SpotifyObserver } from './SpotifyContentObserver';

export const SpotifyAdapter: MusicServiceAdapter = {
  displayName: 'Spotify',
  id: MUSIC_SERVICE.SPOTIFY,
  baseUrl: 'https://open.spotify.com/',
  icon: SpotifyLogo,
  urlMatches: ['*://open.spotify.com/*'],
  disabledFeatures: ['dislike', 'queue'],
  enabledKeyControls: {
    next: true,
    previous: true,
    volumeDown: true,
    volumeUp: true
  },
  backgroundController: () => new SpotifyBackgroundController(),
  contentController: () => new SpotifyContentController(),
  contentObserver: (contentController: ContentController) =>
    new SpotifyObserver(contentController as SpotifyContentController)
};
