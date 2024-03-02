import type { PlasmoCSConfig } from 'plasmo';

import adapters from '~adapters';
import { registerAdapter } from '~core/adapter';
import { matchAdapter } from '~core/adapter/register';

export const config: PlasmoCSConfig = {
  matches: [
    '*://music.amazon.com/*',
    '*://music.apple.com/*',
    '*://open.spotify.com/*',
    '*://music.youtube.com/*'
  ],
  all_frames: true,
  world: 'MAIN'
};

const initialize = () => {
  const adapter = matchAdapter(window.location.href, adapters);

  if (!adapter) {
    return;
  }

  registerAdapter(adapter);
};

initialize();
