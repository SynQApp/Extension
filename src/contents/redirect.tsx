import { parseLink } from '@synq/music-service-clients';
import { UiProvider } from '@synq/ui';
import type { PlasmoCSConfig, PlasmoCSUIProps, PlasmoGetStyle } from 'plasmo';
import { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { StyleSheetManager } from 'styled-components';

import { store } from '~store';
import { RedirectPopup } from '~ui/redirect/RedirectPopup';

export const config: PlasmoCSConfig = {
  matches: [
    '*://music.apple.com/*',
    '*://open.spotify.com/*',
    '*://music.youtube.com/*',
    '*://music.amazon.com/*'
  ]
};

/**
 * Allows styled-components to inject styles into the Plasmo element.
 */
export const getStyle: PlasmoGetStyle = () => {
  const style = document.createElement('style');
  style.setAttribute('data-styled', '');
  return style;
};

export const getShadowHostId = () => 'synq-redirect-popup';

const RedirectUi = ({ anchor }: PlasmoCSUIProps) => {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const parsedLink = parseLink(window.location.href);

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
      setShowPopup(true);
    }
  }, []);

  const handleClose = () => {
    setShowPopup(false);
  };

  const shadowRoot = document.getElementById(getShadowHostId())?.shadowRoot;

  return (
    <Provider store={store}>
      <StyleSheetManager target={shadowRoot as any}>
        <UiProvider>
          <RedirectPopup show={showPopup} onClose={handleClose} />
        </UiProvider>
      </StyleSheetManager>
    </Provider>
  );
};

export default RedirectUi;
