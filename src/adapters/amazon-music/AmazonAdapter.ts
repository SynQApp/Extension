import type { ContentController, MusicServiceAdapter } from '~core/adapter';
import type { ReconnectingHub } from '~core/messaging/hub';

import { AmazonBackgroundController } from './AmazonBackgroundController';
import { AmazonContentController } from './AmazonContentController';
import { AmazonMusicObserver } from './AmazonContentObserver';

export const AmazonAdapater: MusicServiceAdapter = {
  displayName: 'Amazon Music',
  id: 'AMAZONMUSIC',
  baseUrl: 'https://music.amazon.com/',
  icon: '',
  urlMatches: ['*://music.amazon.com/*'],
  disabledFeatures: [],
  backgroundController: () => new AmazonBackgroundController(),
  contentController: () => new AmazonContentController(),
  observer: (contentController: ContentController, reduxHub: ReconnectingHub) =>
    new AmazonMusicObserver(
      contentController as AmazonContentController,
      reduxHub
    )
};
