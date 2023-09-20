import { useAppSelector } from '~store';

export const useTrackTitle = () => {
  const currentTrack = useAppSelector((state) => state.currentTrack);

  return currentTrack?.name;
};
