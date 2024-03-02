import type { ContentController, MusicServiceAdapter } from '~core/adapter';

import { AppleBackgroundController } from './AppleBackgroundController';
import { AppleContentController } from './AppleContentController';
import { AppleObserver } from './AppleContentObserver';

export const AppleAdapter: MusicServiceAdapter = {
  displayName: 'Apple Music',
  id: 'APPLEMUSIC',
  baseUrl: 'https://music.apple.com/',
  icon: '',
  urlMatches: ['*://music.apple.com/*'],
  disabledFeatures: [],
  backgroundController: () => new AppleBackgroundController(),
  contentController: () => new AppleContentController(),
  contentObserver: (contentController: ContentController) =>
    new AppleObserver(contentController as AppleContentController)
};
