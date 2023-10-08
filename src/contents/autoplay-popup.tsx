import { UiProvider } from '@synq/ui';
import type { PlasmoCSConfig, PlasmoCSUIProps, PlasmoGetStyle } from 'plasmo';
import { Provider } from 'react-redux';
import { StyleSheetManager } from 'styled-components';

import { store } from '~store';
import { DocumentContextProvidersWrapper } from '~ui/shared/contexts/DocumentContextProvidersWrapper';

import AutoplayPopup from '../ui/autoplay/AutoplayPopup';

export const config: PlasmoCSConfig = {
  matches: [
    '*://music.apple.com/*',
    '*://open.spotify.com/*',
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
  return (
    <Provider store={store}>
      <UiProvider>
        <DocumentContextProvidersWrapper>
          <StyleSheetManager
            target={anchor?.element?.firstElementChild?.shadowRoot as any}
          >
            <AutoplayPopup />
          </StyleSheetManager>
        </DocumentContextProvidersWrapper>
      </UiProvider>
    </Provider>
  );
};

export default UiEntry;
