import { Avatar, AvatarGroup, Flex, Icon, token } from '@synq/ui';
import { Link } from 'react-router-dom';
import { styled } from 'styled-components';

import type { Listener } from '~types';

interface SessionSectionProps {
  listeners: Listener[];
}

export const SessionSection = ({ listeners }: SessionSectionProps) => {
  return (
    <Container>
      <Flex align="center" justify="space-between">
        <SessionAvatarGroup
          overflowAvatarSize="sm"
          overflowAvatarTextSize="sm"
          max={3}
          spacing="xs"
        >
          {listeners.map((listener) => (
            <Avatar
              key={listener.id}
              src={listener.avatarUrl}
              size="sm"
              name={listener.name}
            />
          ))}
        </SessionAvatarGroup>
        {/* <CopyLinkButton>
          <CopyLinkIcon icon="send" />
          <Text type="body" size="sm">
            Invite
          </Text>
        </CopyLinkButton> */}
        <SessionLink to="/session">Session →</SessionLink>
      </Flex>
    </Container>
  );
};

const Container = styled.section`
  background: ${token('colors.gradient')};
  height: 45px;
  padding: 0 ${token('spacing.sm')};
`;

const SessionAvatarGroup = styled(AvatarGroup)`
  width: 33%;
`;

const CopyLinkButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  margin: 0;
  color: ${token('colors.onBackground')};
  font-family: ${token('typography.fontFamilies.body')};
  font-weight: ${token('typography.fontWeights.bold')};
  font-size: ${token('typography.fontSizes.sm')};
  text-align: center;
  text-decoration: none;
  outline: none;
  gap: ${token('spacing.2xs')};
`;

const CopyLinkIcon = styled(Icon)`
  color: ${token('colors.onBackground')};
  height: 20px;
  width: 20px;
`;

const SessionLink = styled(Link)`
  margin: 0;
  text-align: right;
  text-decoration: none;
  display: block;
  color: ${token('colors.onBackground')};
  cursor: pointer;
  font-family: ${token('typography.fontFamilies.body')};
  font-weight: ${token('typography.fontWeights.bold')};
  font-size: ${token('typography.fontSizes.sm')};
  width: 33%;
`;
