import { usePopupMusicServiceTab } from '~ui/popup/hooks/usePopupMusicServiceTab';
import { ExpandedProvider } from '~ui/shared/contexts/Expanded';
import { MusicServiceTabProvider } from '~ui/shared/contexts/MusicServiceTab';

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
