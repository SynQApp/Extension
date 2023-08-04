import { UiProvider } from '@synq/ui';
import type { PlasmoCSConfig, PlasmoCSUIProps, PlasmoGetStyle } from 'plasmo';
import { StyleSheetManager, styled } from 'styled-components';

import { ExpandedProvider } from '~player-ui/contexts/Expanded';
import Sidebar from '~sidebar/Sidebar';
import { shiftMusicService } from '~sidebar/shiftMusicService';

// shiftMusicService();
(() => {
  if (window.location.href.includes('youtube')) {
    document.querySelector('html').style.fontSize = '1rem';
  }
})();

export const config: PlasmoCSConfig = {
  matches: [
    '*://music.apple.com/*',
    '*://*.spotify.com/*',
    '*://music.youtube.com/*',
    '*://music.amazon.com/*'
  ],
  all_frames: true
};

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
        {/* <Sidebar /> */}
      </StyleSheetManager>
    </UiProvider>
  );
};

export default SidebarEntry;
