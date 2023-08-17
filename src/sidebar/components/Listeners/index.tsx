import {
  Avatar,
  Flex,
  List,
  ListItem,
  Scrollable,
  Text,
  token
} from '@synq/ui';
import styled from 'styled-components';

import { ListItemMenu } from '~player-ui/components/ListItemMenu';
import Layout from '~sidebar/Layout';
import { useSidebarRoot } from '~sidebar/contexts/SidebarRoot';

import { ScreenHeader } from '../ScreenHeader';
import { useListeners } from './useListeners';

export const Listeners = () => {
  const { listeners } = useListeners();
  const sidebarRoot = useSidebarRoot();

  return (
    <Container>
      <Scrollable height="calc(100% - 5px)">
        <ListenerList>
          {listeners.map((listener) => (
            <ListenerListItem
              key={listener.id}
              leftNode={
                <Avatar
                  size="2xl"
                  src={listener.avatarUrl}
                  name={listener.name}
                />
              }
              rightNode={
                <ListItemMenu
                  menuItems={[
                    {
                      text: 'Kick listener',
                      // TODO: Implement
                      onClick: () => console.log('remove listener')
                    }
                  ]}
                  portalContainer={sidebarRoot}
                />
              }
            >
              <ListenerName type="display" size="md">
                {listener.name}
              </ListenerName>
              <ListenerCount type="subtitle" size="xs">
                {listener.trackCount} Songs
              </ListenerCount>
            </ListenerListItem>
          ))}
        </ListenerList>
      </Scrollable>
    </Container>
  );
};

const Container = styled.div`
  height: 100%;
  width: 100%;
`;

const ListenerList = styled(List)`
  background: transparent;
`;

const ListenerListItem = styled(ListItem)`
  padding-left: ${token('spacing.md')};
`;

const ListenerName = styled(Text)`
  font-weight: ${token('typography.fontWeights.semibold')};
  margin: 0;
`;

const ListenerCount = styled(Text)`
  font-weight: ${token('typography.fontWeights.thin')};
  margin: 0;
  margin-top: ${token('spacing.2xs')};
`;
