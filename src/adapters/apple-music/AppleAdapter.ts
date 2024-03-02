import { MUSIC_SERVICE } from '@synq/music-service-clients';
import AppleLogo from 'data-base64:~assets/images/apple-logo.svg';

import type { ContentController, MusicServiceAdapter } from '~core/adapter';

import { AppleBackgroundController } from './AppleBackgroundController';
import { AppleContentController } from './AppleContentController';
import { AppleObserver } from './AppleContentObserver';

export const AppleAdapter: MusicServiceAdapter = {
  displayName: 'Apple Music',
  id: MUSIC_SERVICE.APPLEMUSIC,
  baseUrl: 'https://music.apple.com/',
  icon: AppleLogo,
  urlMatches: ['*://music.apple.com/*'],
  disabledFeatures: ['like', 'dislike'],
  enabledKeyControls: {
    next: true,
    previous: true,
    volumeDown: true,
    volumeUp: true
  },
  backgroundController: () => new AppleBackgroundController(),
  contentController: () => new AppleContentController(),
  contentObserver: (contentController: ContentController) =>
    new AppleObserver(contentController as AppleContentController)
};
