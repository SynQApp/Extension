import { faClose } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { parseLink } from '@synq/music-service-clients';
import { Button, Flex, Icon, Image, Stack, Text, token } from '@synq/ui';
import SynQIcon from 'data-base64:~assets/images/icon-filled.svg';
import { css, styled, useTheme } from 'styled-components';

import { useAppSelector } from '~store';
import { sendAnalytic } from '~util/analytics';
import { getMusicServiceName } from '~util/musicService';

interface RedirectPopupProps {
  show: boolean;
  onClose: () => void;
}

export const RedirectPopup = ({ show, onClose }: RedirectPopupProps) => {
  const settings = useAppSelector((state) => state.settings);
  const theme = useTheme();

  const preferredMusicServiceName = getMusicServiceName(
    settings.preferredMusicService
  );

  const handleOpenWithSynQ = () => {
    const params = new URLSearchParams({
      destinationMusicService: settings.preferredMusicService,
      sourceLink: window.location.href
    });

    const synqUrl = `${
      process.env.PLASMO_PUBLIC_SYNQ_WEBSITE
    }/redirect?${params.toString()}`;

    const parsedLink = parseLink(window.location.href);

    if (parsedLink) {
      const { musicService, trackId } = parsedLink;

      sendAnalytic({
        name: 'redirect_popup_clicked',
        params: {
          musicService,
          preferredMusicService: settings.preferredMusicService,
          type: `${musicService}_${settings.preferredMusicService}`
        }
      });
    }

    window.location.href = synqUrl;
  };

  return (
    <Container $show={show}>
      <Header>
        <Flex align="center">
          <Image src={SynQIcon} alt="SynQ Logo" height="32px" width="32px" />
          <IconButton onClick={onClose}>
            <CloseIcon icon={faClose} color={theme.colors.onBackgroundMedium} />
          </IconButton>
        </Flex>
      </Header>
      <Main>
        <Stack direction="column" spacing="sm">
          <TitleText type="display" size="md" weight="semibold">
            Listen on {preferredMusicServiceName} instead?
          </TitleText>
          <ContinueButton size="medium" onClick={handleOpenWithSynQ}>
            Continue
          </ContinueButton>
        </Stack>
      </Main>
    </Container>
  );
};

interface ContainerProps {
  $show: boolean;
}

const Container = styled.div<ContainerProps>`
  background: ${token('colors.background')};
  margin: auto;
  position: fixed;
  top: 20px;
  border-radius: ${token('radii.md')};
  width: 270px;
  right: -300px;
  transition: right 0.2s ease-in-out;

  ${({ $show }) =>
    $show &&
    css`
      right: 20px;
    `}
`;

const Header = styled.div`
  border-bottom: 1px solid #333;
  padding: ${token('spacing.3xs')} ${token('spacing.md')};
`;

const Main = styled.div`
  padding: ${token('spacing.md')};
`;

const IconButton = styled.button`
  outline: none;
  border: none;
  background: transparent;
  padding: 3px;
  cursor: pointer;
`;

const CloseIcon = styled(FontAwesomeIcon)`
  color: ${token('colors.onBackgroundLow')};
  width: 15px;
  height: 20px;
`;

const TitleText = styled(Text)`
  margin: 0;
  text-align: center;
`;

const ContinueButton = styled(Button)`
  padding: 8px 24px;
  width: 230px;
  font-size: 14px;
  margin: auto;
`;

export default RedirectPopup;
