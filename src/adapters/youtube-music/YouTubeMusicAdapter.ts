import YoutubeLogo from 'data-base64:~assets/images/youtube-logo.svg';

import type { ContentController, MusicServiceAdapter } from '~core/adapter';
import { MUSIC_SERVICE } from '~types';

import { YouTubeMusicBackgroundController } from './YouTubeMusicBackgroundController';
import { YouTubeMusicContentController } from './YouTubeMusicContentController';
import { YouTubeMusicObserver } from './YouTubeMusicContentObserver';

export const YouTubeMusicAdapter: MusicServiceAdapter = {
  displayName: 'YouTube Music',
  secondName: 'YouTube',
  id: MUSIC_SERVICE.YOUTUBEMUSIC,
  baseUrl: 'https://music.youtube.com/',
  icon: YoutubeLogo,
  urlMatches: ['*://music.youtube.com/*'],
  disabledFeatures: [],
  enabledKeyControls: {
    next: true,
    previous: true,
    volumeDown: true,
    volumeUp: true
  },
  backgroundController: () => new YouTubeMusicBackgroundController(),
  contentController: () => new YouTubeMusicContentController(),
  contentObserver: (contentController: ContentController) =>
    new YouTubeMusicObserver(
      contentController as YouTubeMusicContentController
    ),
  menuItems: ({
    link,
    clickEvent
  }: {
    link: string;
    clickEvent: (url: string) => void;
  }) => {
    return [
      {
        icon: 'musicNote',
        text: `View on ${YouTubeMusicAdapter.displayName}`,
        onClick: () => {
          clickEvent(link);
        }
      },
      {
        icon: 'musicNote',
        text: `View on ${YouTubeMusicAdapter.secondName}`,
        onClick: () => {
          clickEvent(link.replace('music.', ''));
        }
      }
    ];
  }
};
