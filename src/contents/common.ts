import type { PlasmoCSConfig } from 'plasmo';

import { AMAZON_KEY_CONTROLS } from '~constants/amazon';
import { APPLE_KEY_CONTROLS } from '~constants/apple';
import { SPOTIFY_KEY_CONTROLS } from '~constants/spotify';
import { YTM_KEY_CONTROLS } from '~constants/youtube';
import { addKeyControlsListener } from '~lib/key-controls/keyControlsListener';

export const config: PlasmoCSConfig = {
  matches: [
    '*://music.apple.com/*',
    '*://open.spotify.com/*',
    '*://music.youtube.com/*',
    '*://music.amazon.com/*'
  ],
  run_at: 'document_start'
};

window.addEventListener('SynQ:GetExtensionId', () => {
  window.dispatchEvent(
    new CustomEvent('SynQ:ExtensionId', { detail: chrome.runtime.id })
  );
});

const keyControlsOptionsMap = {
  'music.youtube.com': YTM_KEY_CONTROLS,
  'music.apple.com': APPLE_KEY_CONTROLS,
  'open.spotify.com': SPOTIFY_KEY_CONTROLS,
  'music.amazon.com': AMAZON_KEY_CONTROLS
};

const keyControlsOptions = keyControlsOptionsMap[window.location.host];

if (keyControlsOptions) {
  addKeyControlsListener(keyControlsOptions);
}
