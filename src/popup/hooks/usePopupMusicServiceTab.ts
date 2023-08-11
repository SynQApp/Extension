import { useAppSelector } from '~store';

export const usePopupMusicServiceTab = () => {
  const musicServiceTabs = useAppSelector((state) => state.musicServiceTabs);

  console.log('musicServiceTabs', musicServiceTabs);

  if (musicServiceTabs.length === 0) {
    return undefined;
  }

  return musicServiceTabs[0];
};
