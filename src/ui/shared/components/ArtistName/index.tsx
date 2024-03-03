import { type TextProps, token } from '@synqapp/ui';
import { styled } from 'styled-components';

import { MarqueeText } from '../MarqueeText';
import { useArtistName } from './useArtistName';

interface ArtistNameProps {
  size: TextProps['size'];
}

export const ArtistName = ({ size }: ArtistNameProps) => {
  const artistName = useArtistName();

  return (
    <ArtistNameText type="body" size={size}>
      {artistName}
    </ArtistNameText>
  );
};

const ArtistNameText = styled(MarqueeText)`
  .text {
    margin: ${token('spacing.3xs')} 0 0;
    color: ${token('colors.onBackgroundMedium')};
    line-height: 14px;
    font-weight: ${token('typography.fontWeights.regular')};
  }
`;
