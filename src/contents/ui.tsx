import { UiProvider } from '@synq/ui';
import type { PlasmoCSConfig, PlasmoCSUIProps, PlasmoGetStyle } from 'plasmo';
import { useEffect, useMemo } from 'react';
import { Provider } from 'react-redux';
import { StyleSheetManager } from 'styled-components';

import { sendToBackground } from '@plasmohq/messaging';

import Sidebar from '~sidebar';
import { SidebarRootProvider } from '~sidebar/contexts/SidebarRoot';
import { store } from '~store';

import AutoplayPopup from './autoplay/AutoplayPopup';

export const config: PlasmoCSConfig = {
  matches: [
    '*://music.apple.com/*',
    '*://*.spotify.com/*',
    '*://music.youtube.com/*',
    '*://music.amazon.com/*'
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

const UiEntry = ({ anchor }: PlasmoCSUIProps) => {
  const container = useMemo(() => {
    const shadowRoot = anchor.element.firstElementChild.shadowRoot;
    const container = shadowRoot.getElementById('plasmo-shadow-container');
    return container as HTMLElement;
  }, [anchor]);

  return (
    <SidebarRootProvider sidebarRoot={container}>
      <Provider store={store}>
        <UiProvider>
          <StyleSheetManager
            target={anchor.element.firstElementChild.shadowRoot as any}
          >
            <Sidebar />
            <AutoplayPopup />
          </StyleSheetManager>
        </UiProvider>
      </Provider>
    </SidebarRootProvider>
  );
};

export default UiEntry;
