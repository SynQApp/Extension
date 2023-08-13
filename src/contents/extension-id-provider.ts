import type { PlasmoCSConfig } from 'plasmo';

export const config: PlasmoCSConfig = {
  matches: [
    '*://music.apple.com/*',
    '*://*.spotify.com/*',
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
