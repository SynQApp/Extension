import type { PlasmoCSConfig } from 'plasmo';

import { enableKeyControls } from '~core/keys';

export const config: PlasmoCSConfig = {
  matches: [
    '*://music.apple.com/*',
    '*://open.spotify.com/*',
    '*://music.youtube.com/*',
    '*://music.amazon.com/*'
  ],
  run_at: 'document_start'
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
