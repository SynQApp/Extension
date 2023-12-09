import { parseLink } from '@synq/music-service-clients';
import type { PlasmoCSConfig } from 'plasmo';

import { store } from '~store';
import { onDocumentReady } from '~util/onDocumentReady';

export const config: PlasmoCSConfig = {
  matches: [
    '*://music.apple.com/*',
    '*://open.spotify.com/*',
    '*://music.youtube.com/*',
    '*://music.amazon.com/*'
  ]
};

const initialize = () => {
  const parsedLink = parseLink(window.location.href);

  console.log('parsedLink', parsedLink);

  if (!parsedLink) {
    return;
  }

  const { musicService, id, type } = parsedLink;

  if (!musicService || !id || type !== 'TRACK') {
    return;
  }

  const state = store.getState();
  const settings = state.settings;

  if (settings.preferredMusicService !== musicService) {
    alert('Would you like to listen on your preferred music service?');

    const params = new URLSearchParams({
      destinationMusicService: settings.preferredMusicService,
      sourceLink: window.location.href
    });

    window.location.href = `https://beta.synqapp.io/redirect?${params.toString()}`;
  }
};

onDocumentReady(() => {
  initialize();
});
