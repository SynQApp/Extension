import type { PlasmoCSConfig } from 'plasmo';

import { AmazonMusicController } from '~lib/controllers/AmazonMusicController';
import { registerControllerHandler } from '~lib/message-handlers/registerControllerHandler';
import { onDocumentReady } from '~util/onDocumentReady';

export const config: PlasmoCSConfig = {
  matches: ['*://music.amazon.com/*'],
  all_frames: true,
  world: 'MAIN'
};

const initialize = () => {
  console.log('HELLO WORLD FROM AMAZON MUSIC');

  const controller = new AmazonMusicController();
  registerControllerHandler(controller);
};

onDocumentReady(initialize);
