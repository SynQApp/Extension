import type { PlasmoCSConfig } from 'plasmo';

import { AMAZON_KEY_CONTROLS } from '~adapters/amazon-music/constants';
import { APPLE_KEY_CONTROLS } from '~adapters/apple-music/constants';
import { SPOTIFY_KEY_CONTROLS } from '~adapters/spotify/constants';
import { YTM_KEY_CONTROLS } from '~adapters/youtube-music/constants';
import { addKeyControlsListener, removeKeyControlsListener } from '~core/keys';
import { persistor, store } from '~store';

export const config: PlasmoCSConfig = {
  matches: [
    '*://music.apple.com/*',
    '*://open.spotify.com/*',
    '*://music.youtube.com/*',
    '*://music.amazon.com/*',
    'http://localhost:3000/spotify/connector*'
  ],
  run_at: 'document_start'
};

const enableKeyControls = () => {
  persistor.subscribe(() => {
    const state = store.getState();
    const { musicServiceKeyControlsEnabled } = state.settings;

    if (!musicServiceKeyControlsEnabled) {
      removeKeyControlsListener();
      return;
    }

    const keyControlsOptionsMap = {
      'music.youtube.com': YTM_KEY_CONTROLS,
      'music.apple.com': APPLE_KEY_CONTROLS,
      'open.spotify.com': SPOTIFY_KEY_CONTROLS,
      'music.amazon.com': AMAZON_KEY_CONTROLS
    };

    const keyControlsOptions =
      keyControlsOptionsMap[
        window.location.host as keyof typeof keyControlsOptionsMap
      ];

    if (keyControlsOptions) {
      addKeyControlsListener(keyControlsOptions);
    }
  });
};

const initialize = () => {
  window.addEventListener('SynQ:GetExtensionId', () => {
    window.dispatchEvent(
      new CustomEvent('SynQ:ExtensionId', { detail: chrome.runtime.id })
    );
  });

  enableKeyControls();
};

initialize();
