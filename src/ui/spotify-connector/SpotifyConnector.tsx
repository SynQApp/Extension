import { Button, Stack, Text, UiProvider, token } from '@synq/ui';
import { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { createGlobalStyle, styled, useTheme } from 'styled-components';

import { sendToBackground } from '@plasmohq/messaging';

import { UiStateMessage } from '~types';
import { PipUi } from '~ui/pip/PipUi';
import { sendMessage } from '~util/sendMessage';

import { useSpotifyPlayer } from './SpotifyPlayerContext';

declare let window: {
  documentPictureInPicture?: {
    requestWindow: (options?: {
      width?: number;
      height?: number;
    }) => Promise<Window>;
  };
};

export const SpotifyConnector = () => {
  const theme = useTheme();
  const { player, deviceId } = useSpotifyPlayer();
  const [showButton, setShowButton] = useState(true);

  useEffect(() => {
    if (window?.documentPictureInPicture) {
      setShowButton(true);
    }
  }, []);

  const handleMinimize = () => {
    sendToBackground({
      name: 'MINIMIZE_WINDOW'
    });
  };

  const handlePip = async () => {
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

    sendToBackground({
      name: 'MINIMIZE_WINDOW'
    });

    setShowButton(false);

    pipWindow.addEventListener('pagehide', () => {
      sendMessage({
        name: UiStateMessage.PIP_CLOSED
      });

      setShowButton(true);
    });
  };

  console.log({ player, deviceId });

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
        {showButton && (
          <Button onClick={handlePip}>Open in Picture in Picture</Button>
        )}
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
