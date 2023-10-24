import type { PlasmoCSConfig } from 'plasmo';

import { sendToBackground } from '@plasmohq/messaging';

export const config: PlasmoCSConfig = {
  matches: [
    '*://*.synqapp.io/spotify/connector*',
    'http://localhost:3000/spotify/connector*'
  ],
  all_frames: true,
  run_at: 'document_start'
};

const main = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');

  if (code) {
    sendToBackground({
      name: 'REDIRECT_TO_TAB',
      body: {
        tabName: 'spotify-connector',
        searchParams: { code }
      }
    });
  }
};

main();
