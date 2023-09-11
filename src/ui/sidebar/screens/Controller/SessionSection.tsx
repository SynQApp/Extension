import { Avatar, AvatarGroup, Flex, token } from '@synq/ui';
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
        <AvatarGroup
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
        </AvatarGroup>
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
`;
