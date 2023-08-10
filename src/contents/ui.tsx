import { UiProvider } from '@synq/ui';
import type { PlasmoCSConfig, PlasmoCSUIProps, PlasmoGetStyle } from 'plasmo';
import { useEffect, useMemo } from 'react';
import { StyleSheetManager } from 'styled-components';

import Sidebar from '~sidebar';
import { SidebarRootProvider } from '~sidebar/contexts/SidebarRoot';

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
      <UiProvider>
        <StyleSheetManager
          target={anchor.element.firstElementChild.shadowRoot as any}
        >
          <Sidebar />
          <AutoplayPopup />
        </StyleSheetManager>
      </UiProvider>
    </SidebarRootProvider>
  );
};

export default UiEntry;
