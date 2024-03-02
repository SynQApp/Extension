import { MUSIC_SERVICE } from '@synq/music-service-clients';
import AmazonLogo from 'data-base64:~assets/images/amazon-logo.svg';

import type { ContentController, MusicServiceAdapter } from '~core/adapter';

import { AmazonBackgroundController } from './AmazonBackgroundController';
import { AmazonContentController } from './AmazonContentController';
import { AmazonMusicObserver } from './AmazonContentObserver';

export const AmazonAdapter: MusicServiceAdapter = {
  displayName: 'Amazon Music',
  id: MUSIC_SERVICE.AMAZONMUSIC,
  baseUrl: 'https://music.amazon.com/',
  icon: AmazonLogo,
  urlMatches: ['*://music.amazon.com/*'],
  disabledFeatures: ['like', 'dislike'],
  enabledKeyControls: {
    volumeDown: true,
    volumeUp: true
  },
  backgroundController: () => new AmazonBackgroundController(),
  contentController: () => new AmazonContentController(),
  contentObserver: (contentController: ContentController) =>
    new AmazonMusicObserver(contentController as AmazonContentController)
};
