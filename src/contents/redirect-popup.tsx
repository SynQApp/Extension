import { UiProvider } from '@synqapp/ui';
import type { PlasmoCSConfig, PlasmoCSUIProps, PlasmoGetStyle } from 'plasmo';
import { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { StyleSheetManager } from 'styled-components';

import { type LinkType, parseLink } from '~core/links';
import { store } from '~store';
import { RedirectPopup } from '~ui/redirect/RedirectPopup';
import { sendAnalytic } from '~util/analytics';

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
  const [linkType, setLinkType] = useState<LinkType | undefined>(undefined);

  useEffect(() => {
    const parsedLink = parseLink(window.location.href);

    if (!parsedLink) {
      return;
    }

    const { musicService, trackId, albumId, artistId, type } = parsedLink;

    if (
      !musicService ||
      (type === 'TRACK' && !trackId) ||
      (type === 'ALBUM' && !albumId) ||
      (type === 'ARTIST' && !artistId)
    ) {
      return;
    }

    setLinkType(type);

    const state = store.getState();
    const settings = state.settings;

    if (
      settings.preferredMusicService !== musicService &&
      settings.redirectsEnabled
    ) {
      setShowPopup(true);

      sendAnalytic({
        name: 'redirect_popup_shown',
        params: {
          musicService,
          preferredMusicService: settings.preferredMusicService,
          type: `${musicService}_${settings.preferredMusicService}`
        }
      });
    }
  }, []);

  const handleClose = () => {
    setShowPopup(false);

    const parsedLink = parseLink(window.location.href);

    if (!parsedLink) {
      return;
    }

    const { musicService } = parsedLink;

    const state = store.getState();
    const settings = state.settings;

    sendAnalytic({
      name: 'redirect_popup_dismissed',
      params: {
        musicService,
        preferredMusicService: settings.preferredMusicService,
        type: `${musicService}_${settings.preferredMusicService}`
      }
    });
  };

  const shadowRoot = document.getElementById(getShadowHostId())?.shadowRoot;

  return (
    <Provider store={store}>
      <StyleSheetManager target={shadowRoot as any}>
        <UiProvider>
          <RedirectPopup
            show={showPopup}
            linkType={linkType}
            onClose={handleClose}
          />
        </UiProvider>
      </StyleSheetManager>
    </Provider>
  );
};

export default RedirectUi;
