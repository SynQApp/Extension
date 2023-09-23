import { useAppSelector } from '~store';
import { useMusicServiceTab } from '~ui/shared/contexts/MusicServiceTab';

export const useArtistName = () => {
  const { musicServiceTab } = useMusicServiceTab();
  const currentTrack = musicServiceTab?.currentTrack;

  return currentTrack?.artistName;
};
