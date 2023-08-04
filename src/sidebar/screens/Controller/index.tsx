import { token } from '@synq/ui';
import { styled } from 'styled-components';

import { PlayerControls } from '~player-ui/components/PlayerControls';

export const ControllerScreen = () => {
  return (
    <PlayerSection>
      <PlayerControls />
    </PlayerSection>
  );
};

const PlayerSection = styled.section`
  background: ${token('colors.background')};
  height: 300px;
  padding: ${token('spacing.xs')} ${token('spacing.md')} 0;
  position: relative;
`;

export default ControllerScreen;
