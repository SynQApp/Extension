import { Button, Flex, Stack, Text, token } from '@synq/ui';
import { styled } from 'styled-components';

import { HOSTS, PERMISSIONS } from '~constants/permissions';

import { Screen } from '../components/Screen';

interface AcceptPermissionsProps {
  goToNextSlide: () => void;
}

export const AcceptPermissions = ({
  goToNextSlide
}: AcceptPermissionsProps) => {
  const handleAcceptPermissions = () => {
    chrome.permissions.request(
      {
        permissions: PERMISSIONS,
        origins: HOSTS
      },
      (granted) => {
        // The callback argument will be true if the user granted the permissions.
        if (granted) {
          goToNextSlide();
        } else {
          alert(
            'Permission denied. SynQ will not work until the permissions have been accepted.'
          );
        }
      }
    );
  };

  return (
    <Screen>
      <Container direction="column" justify="center">
        <Stack direction="column">
          <TitleText type="display" size="3xl" weight="semibold">
            Accept Required Permissions
          </TitleText>
          <DescriptionText type="body" size="md" weight="regular">
            SynQ requires some permissions to work. It requires access to{' '}
            <HighlightedText>store data</HighlightedText> like your preferences,{' '}
            <HighlightedText>access music service websites</HighlightedText> to
            enable the mini player,{' '}
            <HighlightedText>generate notifications</HighlightedText> on song
            change, etc.
          </DescriptionText>
          <ContinueButton size="medium" onClick={handleAcceptPermissions}>
            Accept Permissions
          </ContinueButton>
        </Stack>
      </Container>
    </Screen>
  );
};

const Container = styled(Flex)`
  height: calc(100vh - 100px);
  overflow: hidden;
`;

const TitleText = styled(Text)`
  text-align: center;
  margin: 0 auto;
  display: block;
`;

const DescriptionText = styled(TitleText)`
  max-width: 750px;
  color: ${token('colors.onBackgroundMedium')};
`;

const HighlightedText = styled.span`
  color: ${token('colors.onBackground')};
  font-weight: ${token('typography.fontWeights.semibold')};
`;

const ContinueButton = styled(Button)`
  margin: 0 auto;
  display: block;
`;
