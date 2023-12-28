import { Stack, Text, UiProvider, token } from '@synq/ui';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import styled, {
  StyleSheetManager,
  createGlobalStyle,
  useTheme
} from 'styled-components';

import { store } from '~store';
import Popup from '~ui/popup/Popup';
import { PopupSettingsProvider } from '~ui/popup/contexts/PopupSettingsContext';
import { DocumentContextProvidersWrapper } from '~ui/shared/contexts/DocumentContextProvidersWrapper';
import { MarqueeStylesProvider } from '~ui/shared/styles/MarqueeStylesProvider';

interface PipUiProps {
  pipDocument: Document;
}

export const PipUi = ({ pipDocument }: PipUiProps) => {
  const theme = useTheme();

  return (
    <Provider store={store}>
      <MemoryRouter>
        <StyleSheetManager target={pipDocument.head}>
          <UiProvider>
            <DocumentContextProvidersWrapper>
              <PipGlobalStyles theme={theme} />
              <MarqueeStylesProvider />
              <PopupSettingsProvider
                value={{
                  queueCollapsible: false,
                  document: pipDocument,
                  keyControls: false
                }}
              >
                <Container spacing="none">
                  <Popup />
                  {/* Smiley at end */}
                  <ExpandedText type="body" size="sm">
                    Nothing to see here &#58;&#41;
                  </ExpandedText>
                </Container>
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
    background: ${token('colors.background')};
  }
`;

const Container = styled(Stack)`
  align-items: flex-start;
  justify-content: flex-start;
  height: 100vh;

  & > * {
    flex: 0 0 auto;
  }
`;

const ExpandedText = styled(Text)`
  writing-mode: tb-rl;
  margin-top: ${token('spacing.sm')};
`;
