import { usePopupMusicServiceTab } from '~ui/popup/hooks/usePopupMusicServiceTab';
import { MusicServiceTabProvider } from '~ui/shared/contexts/MusicServiceTab';

import {
  type PopupSettingsContextValue,
  PopupSettingsProvider
} from './PopupSettingsContext';

interface PopupContextProvidersWrapperProps {
  children: React.ReactNode;
  settings?: PopupSettingsContextValue;
}

export const PopupContextProvidersWrapper = ({
  children,
  settings
}: PopupContextProvidersWrapperProps) => {
  const musicServiceTabValue = usePopupMusicServiceTab();

  return (
    <MusicServiceTabProvider value={musicServiceTabValue}>
      <PopupSettingsProvider value={settings}>{children}</PopupSettingsProvider>
    </MusicServiceTabProvider>
  );
};

export default PopupContextProvidersWrapper;
