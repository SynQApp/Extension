import { UiProvider } from '@synqapp/ui';
import type { PlasmoCSConfig, PlasmoCSUIProps, PlasmoGetStyle } from 'plasmo';
import { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { StyleSheetManager } from 'styled-components';

import adapters from '~adapters';
import { type LinkType, parseLink } from '~core/links';
import { getSettings, store } from '~store';
import type { MusicService } from '~types';
import { RedirectPopup } from '~ui/redirect/RedirectPopup';
import { sendAnalytic } from '~util/analytics';

// Services that can be redirected *to*. A service opts out (e.g. Spotify, whose
// search API is locked down) by listing 'redirect' in its disabledFeatures.
const REDIRECT_ENABLED_SERVICES = new Set<MusicService | undefined>(
  adapters
    .filter((adapter) => !adapter.disabledFeatures?.includes('redirect'))
    .map((adapter) => adapter.id)
);

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

    let cancelled = false;

    const maybeShowPopup = async () => {
      // Wait for the persisted settings to load. Reading them synchronously
      // here races rehydration and yields the default preferred service
      // ('SPOTIFY'), which shows a redirect prompt to users who never asked
      // for one.
      const settings = await getSettings();

      if (cancelled) {
        return;
      }

      if (
        settings.preferredMusicService !== musicService &&
        settings.redirectsEnabled &&
        REDIRECT_ENABLED_SERVICES.has(settings.preferredMusicService)
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
    };

    maybeShowPopup();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleClose = async () => {
    setShowPopup(false);

    const parsedLink = parseLink(window.location.href);

    if (!parsedLink) {
      return;
    }

    const { musicService } = parsedLink;

    const settings = await getSettings();

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
