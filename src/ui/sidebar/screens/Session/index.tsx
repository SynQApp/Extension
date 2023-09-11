import { Text, token } from '@synq/ui';
import { styled } from 'styled-components';

import Layout from '~ui/sidebar/Layout';
import { Listeners } from '~ui/sidebar/components/Listeners';
import { ScreenHeader } from '~ui/sidebar/components/ScreenHeader';

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
      <SubHeader type="subtitle" size="md">
        Listeners
      </SubHeader>
      <Listeners />
    </Layout>
  );
};

export default SessionScreen;

const Heading = styled(Text)`
  font-weight: ${token('typography.fontWeights.semibold')};
  margin: 0;
`;

const SubHeader = styled(Text)`
  color: ${token('colors.onBackgroundLow')};
  margin: ${token('spacing.xs')} ${token('spacing.md')};
`;
