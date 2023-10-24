import { Button, Stack, Text, UiProvider, token } from '@synq/ui';
import { createGlobalStyle, styled, useTheme } from 'styled-components';

import { sendToBackground } from '@plasmohq/messaging';

import { useSpotifyPlayer } from './SpotifyPlayerContext';

export const SpotifyConnector = () => {
  const theme = useTheme();
  const { player } = useSpotifyPlayer();

  const handleMinimize = () => {
    sendToBackground({
      name: 'MINIMIZE_WINDOW'
    });
  };

  return (
    <UiProvider>
      <GlobalStyle theme={theme} />
      <Container justify="center" direction="column" spacing="xl">
        <Text type="display" size="4xl">
          Spotify Connector
        </Text>
        <Text type="body" size="lg">
          Connected: {player ? 'Yes' : 'No'}
        </Text>
        <Button onClick={handleMinimize}>Minimize</Button>
        <Text type="body" size="sm">
          Note: Keep this window open to stay connected to Spotify.
        </Text>
      </Container>
    </UiProvider>
  );
};

const GlobalStyle = createGlobalStyle`
  body {
    background: ${token('colors.background')};
    margin: 0;
    padding: 0;
  }
`;

const Container = styled(Stack)`
  background: ${token('colors.background')};
`;
