import type { PlasmoCSConfig } from 'plasmo';

import { SpotifyAdapter } from '~adapters/spotify/SpotifyAdapter';
import { registerAdapter } from '~core/adapter';

export const config: PlasmoCSConfig = {
  matches: ['*://open.spotify.com/*'],
  all_frames: true,
  world: 'MAIN'
};

registerAdapter(SpotifyAdapter);
