import { ExpandedProvider } from '~player-ui/contexts/Expanded';
import { MusicServiceTabProvider } from '~player-ui/contexts/MusicServiceTab';
import { usePopupMusicServiceTab } from '~popup/hooks/usePopupMusicServiceTab';

export const PopupContextProvidersWrapper = ({ children }: any) => {
  const musicServiceTabValue = usePopupMusicServiceTab();

  return (
    <ExpandedProvider expanded={false}>
      <MusicServiceTabProvider value={musicServiceTabValue}>
        {children}
      </MusicServiceTabProvider>
    </ExpandedProvider>
  );
};

export default PopupContextProvidersWrapper;
