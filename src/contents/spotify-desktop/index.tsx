import { UiProvider } from '@synq/ui';
import type { PlasmoCSConfig, PlasmoCSUIProps, PlasmoGetStyle } from 'plasmo';
import { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { StyleSheetManager } from 'styled-components';

import { SPOTIFY_ENABLED } from '~constants/features';
import { store } from '~store';
import { SpotifyConnector } from '~ui/spotify-connector/SpotifyConnector';
import { SpotifyPlayerProvider } from '~ui/spotify-connector/SpotifyPlayerContext';

export const config: PlasmoCSConfig = {
  matches: [
    '*://*.synqapp.io/spotify/connector*',
    'http://localhost:3000/spotify/connector*'
  ],
  all_frames: true
};

/**
 * Allows styled-components to inject styles into the Plasmo element.
 */
export const getStyle: PlasmoGetStyle = () => {
  const style = document.createElement('style');
  style.setAttribute('data-styled', '');
  return style;
};

const SpotifyConnectorEntry = ({ anchor }: PlasmoCSUIProps) => {
  const [extensionId, setExtensionId] = useState<string | undefined>();

  useEffect(() => {
    if (!SPOTIFY_ENABLED) {
      return;
    }

    window.addEventListener('SynQ:ExtensionId', (e) => {
      const extensionId = (e as CustomEvent).detail;
      setExtensionId(extensionId);
    });

    window.dispatchEvent(new CustomEvent('SynQ:GetExtensionId'));
  }, []);

  if (!extensionId?.length) {
    return null;
  }

  return (
    <StyleSheetManager
      target={anchor?.element?.firstElementChild?.shadowRoot as any}
    >
      <UiProvider>
        <Provider store={store}>
          <SpotifyPlayerProvider extensionId={extensionId}>
            <SpotifyConnector />
          </SpotifyPlayerProvider>
        </Provider>
      </UiProvider>
    </StyleSheetManager>
  );
};

export default SpotifyConnectorEntry;
