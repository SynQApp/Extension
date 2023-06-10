import type { PlasmoCSConfig } from 'plasmo';

import { AppleMusicController } from '~lib/controllers/AppleMusicController';
import { registerControllerHandler } from '~lib/message-handlers/registerControllerHandler';
import { onDocumentReady } from '~util/onDocumentReady';

export const config: PlasmoCSConfig = {
  matches: ['*://music.apple.com/*'],
  all_frames: true,
  world: 'MAIN'
};

const initialize = () => {
  console.log('SynQ: Initializing Apple Music');

  const controller = new AppleMusicController();
  registerControllerHandler(controller);
};

onDocumentReady(initialize);
