import { useAppSelector } from '~store';

export const useArtistName = () => {
  const currentTrack = useAppSelector((state) => state.currentTrack);

  return currentTrack?.artistName;
};
