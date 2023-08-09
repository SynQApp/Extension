import { Text, token } from '@synq/ui';
import { styled } from 'styled-components';

export const EmptyText = styled(Text)`
  color: ${token('colors.onBackgroundMedium')};
  text-align: center;
  margin: ${token('spacing.sm')} ${token('spacing.md')};
  line-height: 1.5;
`;
