import { ExpandedProvider } from '~player-ui/contexts/Expanded';
import { MusicServiceProvider } from '~player-ui/contexts/MusicService';
import { useMusicService } from '~popup/hooks/useMusicService';

export const PopupContextProvidersWrapper = ({ children }: any) => {
  const musicService = useMusicService();

  return (
    <ExpandedProvider expanded={false}>
      <MusicServiceProvider value={musicService}>
        {children}
      </MusicServiceProvider>
    </ExpandedProvider>
  );
};

export default PopupContextProvidersWrapper;
