import { type TextProps } from '@synq/ui';
import { styled } from 'styled-components';

import { MarqueeText } from '../MarqueeText';
import { useTrackTitle } from './useTrackTitle';

interface TrackTitleProps {
  size: TextProps['size'];
  weight?: TextProps['weight'];
}

export const TrackTitle = ({ size, weight }: TrackTitleProps) => {
  const trackTitle = useTrackTitle();

  return (
    <TrackTitleText type="subtitle" size={size} weight={weight}>
      {trackTitle}
    </TrackTitleText>
  );
};

const TrackTitleText = styled(MarqueeText)`
  .text {
    margin: 0;
  }
`;
