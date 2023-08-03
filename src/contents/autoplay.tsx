import { UiProvider } from '@synq/ui';
import type { PlasmoCSConfig, PlasmoCSUIProps, PlasmoGetStyle } from 'plasmo';
import { StyleSheetManager, styled } from 'styled-components';

import Popup from './autoplay/Popup';

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

const Autoplay = ({ anchor }: PlasmoCSUIProps) => {
  return (
    <UiProvider>
      <StyleSheetManager
        target={anchor.element.firstElementChild.shadowRoot as any}
      >
        <Popup />
      </StyleSheetManager>
    </UiProvider>
  );
};

export default Autoplay;
