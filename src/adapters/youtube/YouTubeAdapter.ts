import YoutubeLogo from 'data-base64:~assets/images/youtube-logo.svg';

import type { ContentController, MusicServiceAdapter } from '~core/adapter';
import { MUSIC_SERVICE } from '~types';

import { YouTubeBackgroundController } from './YouTubeBackgroundController';
import { YouTubeContentController } from './YouTubeContentController';
import { YouTubeContentObserver } from './YouTubeContentObserver';

export const YouTubeAdapter: MusicServiceAdapter = {
  displayName: 'YouTube',
  id: MUSIC_SERVICE.YOUTUBE,
  baseUrl: 'https://www.youtube.com/',
  icon: YoutubeLogo,
  urlMatches: ['*://www.youtube.com/*'],
  disabledFeatures: [],
  enabledKeyControls: {
    next: true,
    previous: true,
    volumeDown: true,
    volumeUp: true
  },
  backgroundController: () => new YouTubeBackgroundController(),
  contentController: () => new YouTubeContentController(),
  contentObserver: (contentController: ContentController) =>
    new YouTubeContentObserver(contentController as YouTubeContentController)
};
