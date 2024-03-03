import { Text, type TextProps, token } from '@synqapp/ui';
import { styled } from 'styled-components';

import { MarqueeText } from '../MarqueeText';
import { useTrackTitle } from './useTrackTitle';

interface TrackTitleProps {
  size: TextProps['size'];
  weight?: TextProps['weight'];
}

export const TrackTitle = ({ size, weight }: TrackTitleProps) => {
  const trackTitle = useTrackTitle();

  return trackTitle ? (
    <TrackTitleText type="subtitle" size={size} weight={weight}>
      {trackTitle}
    </TrackTitleText>
  ) : (
    <NoMusicText type="subtitle" size={size} weight={weight}>
      No Music Playing
    </NoMusicText>
  );
};

const TrackTitleText = styled(MarqueeText)`
  .text {
    margin: 0;
  }
`;

const NoMusicText = styled(Text)`
  color: ${token('colors.onBackgroundLow')};
  margin: 0;
`;
