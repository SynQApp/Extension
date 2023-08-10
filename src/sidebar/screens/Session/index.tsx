import { Flex, Text, token } from '@synq/ui';
import { styled } from 'styled-components';

import Layout from '~sidebar/Layout';
import { ScreenHeader } from '~sidebar/components/ScreenHeader';

export const SessionScreen = () => {
  return (
    <Layout
      header={
        <ScreenHeader>
          <Heading type="display" size="xl">
            Session
          </Heading>
        </ScreenHeader>
      }
    >
      {' '}
    </Layout>
  );
};

export default SessionScreen;

const Heading = styled(Text)`
  font-weight: ${token('typography.fontWeights.semibold')};
  margin: 0;
`;
