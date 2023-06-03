import type { PlasmoCSConfig } from 'plasmo';

import { onDocumentReady } from '~util/onDocumentReady';

export const config: PlasmoCSConfig = {
  matches: ['*://music.youtube.com/*'],
  all_frames: true
};

const initialize = () => {
  console.log('HELLO WORLD FROM YOUTUBE MUSIC');
};

onDocumentReady(initialize);
