import type { PlasmoCSConfig } from 'plasmo';

import { onDocumentReady } from '~util/onDocumentReady';

export const config: PlasmoCSConfig = {
  matches: ['*://*.spotify.com/*'],
  all_frames: true
};

const initialize = () => {
  console.info('SynQ: Initializing Spotify');
};

onDocumentReady(initialize);
