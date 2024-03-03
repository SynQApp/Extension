import type { PlasmoCSConfig } from 'plasmo';

import { sendToBackground } from '~core/messaging';
import { onDocumentReady } from '~util/onDocumentReady';

export const config: PlasmoCSConfig = {
  matches: ['https://*.synqapp.io/redirect*'],
  all_frames: true
};

declare let window: Window & {
  setDestinationLink: (link: string) => void;
};

const initialize = async () => {
  const url = new URL(window.location.href);
  const destinationMusicService = url.searchParams.get(
    'destinationMusicService'
  );
  const name = url.searchParams.get('name');
  const artistName = url.searchParams.get('artistName');
  const albumName = url.searchParams.get('albumName');
  const duration = url.searchParams.get('duration');
  const linkType = url.searchParams.get('linkType');

  const link = await sendToBackground({
    name: 'GET_REDIRECT_LINK',
    body: {
      destinationMusicService,
      trackName: name,
      artistName,
      albumName,
      duration,
      linkType
    }
  });

  const event = new CustomEvent('SynQ:SetDestinationLink', {
    detail: link
  });

  window.dispatchEvent(event);
};

onDocumentReady(async () => {
  console.info('SynQ: Redirect initialized');
  await initialize();
});
