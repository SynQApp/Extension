import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Flex, Image, Stack, Text, UiProvider, token } from '@synq/ui';
import SynQLogo from 'data-base64:~assets/images/icon-filled.svg';
import SpotifyLogo from 'data-base64:~assets/images/spotify-logo.svg';
import { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { styled } from 'styled-components';

import { sendToBackground } from '@plasmohq/messaging';

import { UiStateMessage } from '~types';
import { PipUi } from '~ui/pip/PipUi';
import Logo from '~ui/shared/components/Logo';
import { sendAnalytic } from '~util/analytics';
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
  const [enabled, setEnabled] = useState(false);
  const { player, error } = useSpotifyPlayer();
  const [showPipButton, setShowPipButton] = useState(true);

  useEffect(() => {
    if (window?.documentPictureInPicture) {
      setShowPipButton(true);
    }
  }, []);

  const handlePip = async () => {
    sendAnalytic({
      name: 'pip_opened'
    });

    const pipWindow = await window.documentPictureInPicture?.requestWindow({
      width: 350,
      height: 350
    });

    if (!pipWindow) return;

    const container = pipWindow.document.createElement('div');
    pipWindow.document.body.append(container);

    const pipRoot = createRoot(container);
    pipRoot.render(
      <UiProvider>
        <PipUi pipDocument={pipWindow.document} />
      </UiProvider>
    );

    sendMessage({
      name: UiStateMessage.PIP_OPENED
    });

    sendToBackground({
      name: 'MINIMIZE_WINDOW'
    });

    setShowPipButton(false);

    pipWindow.addEventListener('pagehide', () => {
      sendMessage({
        name: UiStateMessage.PIP_CLOSED
      });

      setShowPipButton(true);

      sendAnalytic({ name: 'pip_closed' });
    });
  };

  const handleEnable = () => {
    setEnabled(true);
  };

  return (
    <UiProvider>
      <Container>
        <Content justify="center" direction="column" spacing="md">
          <LogoContainer align="center">
            <Logo size="controller" />
            {showPipButton && enabled && player && !error && (
              <span>
                <Button
                  variant="secondary"
                  onClick={handlePip}
                  size="small"
                  rounded
                >
                  Pop Out
                </Button>
              </span>
            )}
          </LogoContainer>
          {error ? (
            <StatusText type="body" size="sm" weight="regular">
              {error}
            </StatusText>
          ) : enabled ? (
            <>
              <Stack align="center" justify="center" spacing="lg">
                <Image
                  src={SynQLogo}
                  alt="SynQ Logo"
                  height="70px"
                  width="70px"
                />
                <FontAwesomeIcon
                  icon={faArrowRight}
                  height="30px"
                  width="30px"
                  color="white"
                />
                <Image
                  src={SpotifyLogo}
                  alt="Spotify Logo"
                  height="60px"
                  width="60px"
                />
              </Stack>
              <StatusText type="subtitle" size="md" weight="regular">
                {player ? 'Connected!' : 'Connecting...'}
              </StatusText>
            </>
          ) : (
            <EnableButton onClick={handleEnable} size="small" rounded>
              Start Listening
            </EnableButton>
          )}

          <NoteText type="body" size="xs">
            Note: Keep this window open to stay connected to Spotify.
          </NoteText>
        </Content>
      </Container>
    </UiProvider>
  );
};

const Container = styled.div`
  background: ${token('colors.background')};
  margin: 0;
  padding: 0;
  height: 100vh;
  width: 100vw;
`;

const Content = styled(Stack)`
  background: ${token('colors.background')};
  width: 100vw;
`;

const LogoContainer = styled(Flex)`
  padding: 0 ${token('spacing.md')};
`;

const StatusText = styled(Text)`
  color: ${token('colors.onBackground')};
  letter-spacing: 0.5px;
  margin: 0 ${token('spacing.md')};
  text-align: center;
  display: block;
`;

const NoteText = styled(Text)`
  color: ${token('colors.onBackgroundLow')};
  margin: 0;
  margin-top: ${token('spacing.md')};
  padding: 0 ${token('spacing.md')} ${token('spacing.md')};
  text-align: center;
  display: block;
`;

const EnableButton = styled(Button)`
  display: block;
  margin: 40px auto;
  width: 200px;
`;
