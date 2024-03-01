import type { PlasmoCSConfig } from 'plasmo';

import { sendToBackground } from '@plasmohq/messaging';

import { onDocumentReady } from '~util/onDocumentReady';

export const config: PlasmoCSConfig = {
  matches: [
    'https://*.synqapp.io/redirectv2',
    'https://website-git-local-redirect-synqapp.vercel.app/redirectv2*'
  ],
  all_frames: true
};

declare global {
  interface Window {
    setDestinationLink: (link: string) => void;
  }
}

const initialize = async () => {
  const url = new URL(window.location.href);
  const destinationMusicService = url.searchParams.get(
    'destinationMusicService'
  );
  const name = url.searchParams.get('name');
  const artistName = url.searchParams.get('artistName');
  const albumName = url.searchParams.get('albumName');
  const duration = url.searchParams.get('duration');

  const link = await sendToBackground({
    name: 'GET_REDIRECT_LINK',
    body: {
      destinationMusicService,
      name,
      artistName,
      albumName,
      duration
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