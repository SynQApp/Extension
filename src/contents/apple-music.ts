import type { PlasmoCSConfig } from 'plasmo';

import { onDocumentReady } from '~util/onDocumentReady';

export const config: PlasmoCSConfig = {
  matches: ['*://music.apple.com/*'],
  all_frames: true
};

const initialize = () => {
  console.log('HELLO WORLD FROM APPLE MUSIC');
};

onDocumentReady(initialize);
