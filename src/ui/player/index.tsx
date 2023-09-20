import { UiProvider } from '@synq/ui';
import { MemoryRouter } from 'react-router-dom';

import { MarqueeStylesProvider } from '~ui/shared/styles/MarqueeStylesProvider';

import { Player } from './Player';
import { PlayerProvider } from './contexts/PlayerContext';

export const SidebarIndex = () => {
  return (
    <MemoryRouter>
      <UiProvider>
        <PlayerProvider>
          <MarqueeStylesProvider>
            <Player />
          </MarqueeStylesProvider>
        </PlayerProvider>
      </UiProvider>
    </MemoryRouter>
  );
};

export default SidebarIndex;
