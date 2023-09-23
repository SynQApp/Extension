import { useAppSelector } from '~store';
import { useMusicServiceTab } from '~ui/shared/contexts/MusicServiceTab';

export const useTrackTitle = () => {
  const { musicServiceTab } = useMusicServiceTab();
  const currentTrack = musicServiceTab?.currentTrack;

  return currentTrack?.name;
};
