import type { PlasmoCSConfig } from 'plasmo';

import { onDocumentReady } from '~util/onDocumentReady';

export const config: PlasmoCSConfig = {
  matches: ['*://music.amazon.com/*'],
  all_frames: true
};

const initialize = () => {
  console.log('HELLO WORLD FROM AMAZON MUSIC');
};

onDocumentReady(initialize);
