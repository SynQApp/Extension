import { Flex, Text, TextField, token } from '@synq/ui';
import { styled } from 'styled-components';

import Layout from '~sidebar/Layout';
import { ScreenHeader } from '~sidebar/components/ScreenHeader';

export const SearchScreen = () => {
  return (
    <Layout
      header={
        <ScreenHeader>
          <TextFieldStyled placeholder="Search" size="small" />
        </ScreenHeader>
      }
    >
      {' '}
    </Layout>
  );
};

export default SearchScreen;

const TextFieldStyled = styled(TextField)`
  flex: 1;
  margin-right: ${token('spacing.xs')};
`;
