import { usePopupMusicServiceTab } from '~ui/popup/hooks/usePopupMusicServiceTab';
import { MusicServiceTabProvider } from '~ui/shared/contexts/MusicServiceTab';

export const PopupContextProvidersWrapper = ({ children }: any) => {
  const musicServiceTabValue = usePopupMusicServiceTab();

  return (
    <MusicServiceTabProvider value={musicServiceTabValue}>
      {children}
    </MusicServiceTabProvider>
  );
};

export default PopupContextProvidersWrapper;
