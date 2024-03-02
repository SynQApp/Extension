import type { ContentController, MusicServiceAdapter } from '~core/adapter';
import type { ReduxHub } from '~util/connectToReduxHub';

import { SpotifyBackgroundController } from './SpotifyBackgroundController';
import { SpotifyContentController } from './SpotifyContentController';
import { SpotifyObserver } from './SpotifyContentObserver';

export const SpotifyAdapter: MusicServiceAdapter = {
  displayName: 'Spotify',
  id: 'SPOTIFY',
  baseUrl: 'https://open.spotify.com/',
  icon: '',
  urlMatches: ['*://open.spotify.com/*'],
  disabledFeatures: [],
  backgroundController: () => new SpotifyBackgroundController(),
  contentController: () => new SpotifyContentController(),
  observer: (contentController: ContentController, reduxHub: ReduxHub) =>
    new SpotifyObserver(contentController as SpotifyContentController, reduxHub)
};
