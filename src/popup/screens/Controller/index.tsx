import { token } from '@synq/ui';
import styled from 'styled-components';

import useControllerScreen from './useControllerScreen';

const ControllerScreen = () => {
  useControllerScreen();

  return <PlayerSection></PlayerSection>;
};

const PlayerSection = styled.section`
  background: ${token('colors.background')};
  width: 100%;
  height: 100%;
`;

export default ControllerScreen;
