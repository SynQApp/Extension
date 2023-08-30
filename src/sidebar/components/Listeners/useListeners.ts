import { useAppSelector } from '~store';

export const useListeners = () => {
  const listeners = useAppSelector((state) => state.session.listeners);

  return {
    listeners
  };
};
