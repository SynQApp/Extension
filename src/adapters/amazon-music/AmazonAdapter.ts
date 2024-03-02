import type { ContentController, MusicServiceAdapter } from '~core/adapter';

import { AmazonBackgroundController } from './AmazonBackgroundController';
import { AmazonContentController } from './AmazonContentController';
import { AmazonMusicObserver } from './AmazonContentObserver';

export const AmazonAdapter: MusicServiceAdapter = {
  displayName: 'Amazon Music',
  id: 'AMAZONMUSIC',
  baseUrl: 'https://music.amazon.com/',
  icon: '',
  urlMatches: ['*://music.amazon.com/*'],
  disabledFeatures: [],
  backgroundController: () => new AmazonBackgroundController(),
  contentController: () => new AmazonContentController(),
  contentObserver: (contentController: ContentController) =>
    new AmazonMusicObserver(contentController as AmazonContentController)
};
