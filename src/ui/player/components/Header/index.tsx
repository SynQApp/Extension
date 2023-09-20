import { Flex, Icon, Stack, Text, token } from '@synq/ui';
import { styled, useTheme } from 'styled-components';

import Logo from '~ui/shared/components/Logo';

import { useHeader } from './useHeader';

export const Header = () => {
  const { closePlayer, musicServiceName } = useHeader();
  const theme = useTheme();

  return (
    <Container direction="row">
      <Logo size="page" />
      <Stack direction="row" spacing="md" align="center">
        <Text type="body" size="md">
          Close session and return to {musicServiceName}
        </Text>
        <CloseButton onClick={closePlayer}>
          <Icon icon="close" color={theme.colors.onBackground} />
        </CloseButton>
      </Stack>
    </Container>
  );
};

const Container = styled(Flex)`
  width: 100vw;
  height: unset;
  padding-left: ${token('spacing.sm')};
  padding-right: ${token('spacing.md')};
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  padding: 0;
  margin: 0;
  outline: none;
`;
