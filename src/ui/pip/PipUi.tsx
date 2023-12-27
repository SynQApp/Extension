import { UiProvider } from '@synq/ui';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { StyleSheetManager, createGlobalStyle } from 'styled-components';

import { store } from '~store';
import Popup from '~ui/popup/Popup';
import { PopupSettingsProvider } from '~ui/popup/contexts/PopupSettingsContext';
import { DocumentContextProvidersWrapper } from '~ui/shared/contexts/DocumentContextProvidersWrapper';
import { MarqueeStylesProvider } from '~ui/shared/styles/MarqueeStylesProvider';

interface PipUiProps {
  pipDocument: Document;
}

export const PipUi = ({ pipDocument }: PipUiProps) => {
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
                  document: pipDocument,
                  keyControls: false
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

const PipGlobalStyles = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
  }
`;
