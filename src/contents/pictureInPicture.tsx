import { Button, UiProvider } from '@synq/ui';
import type { PlasmoCSConfig, PlasmoCSUIProps, PlasmoGetStyle } from 'plasmo';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { StyleSheetManager, createGlobalStyle } from 'styled-components';

import { store } from '~store';
import { UiStateMessage } from '~types';
import Popup from '~ui/popup/Popup';
import { PopupSettingsProvider } from '~ui/popup/contexts/PopupSettingsContext';
import { DocumentContextProvidersWrapper } from '~ui/shared/contexts/DocumentContextProvidersWrapper';
import { MarqueeStylesProvider } from '~ui/shared/styles/MarqueeStylesProvider';
import { sendMessage } from '~util/sendMessage';

declare let window: {
  documentPictureInPicture?: {
    requestWindow: (options?: {
      width?: number;
      height?: number;
    }) => Promise<Window>;
  };
};

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
  style.id = 'synq-pip-style';
  style.setAttribute('data-styled', '');
  return style;
};

export const getRootContainer = () => {
  const container = document.createElement('div');
  container.setAttribute('id', 'synq-pip-container');
  container.style.position = 'fixed';
  container.style.top = '0';
  container.style.left = '0';
  container.style.zIndex = '99';

  document.body.append(container);
  return container;
};

const PipTriggerUi = ({ anchor }: PlasmoCSUIProps) => {
  const handleButtonClick = async () => {
    const pipWindow = await window.documentPictureInPicture?.requestWindow({
      width: 350,
      height: 350
    });

    if (!pipWindow) return;

    const container = pipWindow.document.createElement('div');
    pipWindow.document.body.append(container);

    const pipRoot = createRoot(container);
    pipRoot.render(<PipUi pipDocument={pipWindow.document} />);

    sendMessage({
      name: UiStateMessage.PIP_OPENED
    });

    pipWindow.addEventListener('pagehide', () => {
      sendMessage({
        name: UiStateMessage.PIP_CLOSED
      });
    });
  };

  return (
    <Provider store={store}>
      <UiProvider>
        <Button onClick={handleButtonClick}>Open PiP</Button>
      </UiProvider>
    </Provider>
  );
};

interface TestSimpleChildProps {
  pipDocument: Document;
}

const PipGlobalStyles = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
  }
`;

export const PipUi = ({ pipDocument }: TestSimpleChildProps) => {
  return (
    <Provider store={store}>
      <MemoryRouter>
        <StyleSheetManager target={pipDocument.head}>
          <UiProvider>
            <DocumentContextProvidersWrapper>
              <PipGlobalStyles />
              <MarqueeStylesProvider />
              <PopupSettingsProvider
                value={{
                  queueCollapsible: false,
                  document: pipDocument
                }}
              >
                <Popup />
              </PopupSettingsProvider>
            </DocumentContextProvidersWrapper>
          </UiProvider>
        </StyleSheetManager>
      </MemoryRouter>
    </Provider>
  );
};

export default PipTriggerUi;
