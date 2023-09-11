import { Scrollable, token } from '@synq/ui';
import { createGlobalStyle, useTheme } from 'styled-components';

import { Header } from './components/Header';
import { OptionsContent } from './components/OptionsContent';

export const Options = () => {
  const theme = useTheme();

  return (
    <>
      <GlobalStyle theme={theme} />
      <Scrollable height="100vh">
        <Header />
        <OptionsContent />
      </Scrollable>
    </>
  );
};

const GlobalStyle = createGlobalStyle`
  body {
    background-color: ${token('colors.background')};
    margin: 0;
    padding: 0;
    height: 100%;
    width: 100%;
  }
`;
