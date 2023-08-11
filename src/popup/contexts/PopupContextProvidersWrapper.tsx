import { MusicServiceProvider } from '~player-ui/contexts/MusicService';
import { useMusicService } from '~popup/hooks/useMusicService';

export const PopupContextProvidersWrapper = ({ children }: any) => {
  const musicService = useMusicService();

  return (
    <MusicServiceProvider value={musicService}>{children}</MusicServiceProvider>
  );
};

export default PopupContextProvidersWrapper;
