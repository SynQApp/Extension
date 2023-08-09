import { UiProvider } from '@synq/ui';
import type { PlasmoCSConfig, PlasmoCSUIProps, PlasmoGetStyle } from 'plasmo';
import { StyleSheetManager } from 'styled-components';

import Sidebar from '~sidebar';

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

const SidebarEntry = ({ anchor }: PlasmoCSUIProps) => {
  return (
    <UiProvider>
      <StyleSheetManager
        target={anchor.element.firstElementChild.shadowRoot as any}
      >
        <Sidebar />
      </StyleSheetManager>
    </UiProvider>
  );
};

export default SidebarEntry;
