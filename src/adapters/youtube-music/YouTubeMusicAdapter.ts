import type { ContentController, MusicServiceAdapter } from '~core/adapter';

import { YouTubeMusicBackgroundController } from './YouTubeMusicBackgroundController';
import { YouTubeMusicContentController } from './YouTubeMusicContentController';
import { YouTubeMusicObserver } from './YouTubeMusicContentObserver';

export const YouTubeMusicAdapter: MusicServiceAdapter = {
  displayName: 'YouTube Music',
  id: 'YOUTUBE',
  baseUrl: 'https://music.youtube.com/',
  icon: '',
  urlMatches: ['*://music.spotify.com/*'],
  disabledFeatures: [],
  backgroundController: () => new YouTubeMusicBackgroundController(),
  contentController: () => new YouTubeMusicContentController(),
  observer: (contentController: ContentController) =>
    new YouTubeMusicObserver(contentController as YouTubeMusicContentController)
};
