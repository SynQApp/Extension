import type { PlasmoCSConfig } from 'plasmo';

import { AMAZON_KEY_CONTROLS } from '~constants/amazon';
import { APPLE_KEY_CONTROLS } from '~constants/apple';
import { SPOTIFY_KEY_CONTROLS } from '~constants/spotify';
import { YTM_KEY_CONTROLS } from '~constants/youtube';
import {
  addKeyControlsListener,
  removeKeyControlsListener
} from '~shared/keyControlsListener';
import { persistor, store } from '~store';

export const config: PlasmoCSConfig = {
  matches: [
    '*://music.apple.com/*',
    '*://open.spotify.com/*',
    '*://music.youtube.com/*',
    '*://music.amazon.com/*',
    '*://*.synqapp.io/spotify/connector',
    'http://localhost:3000/spotify/connector'
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
