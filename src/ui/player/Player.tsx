import { Layout } from './components/Layout';
import { usePlayerContext } from './contexts/PlayerContext';
import { usePreventBodyScroll } from './hooks/usePreventBodyScroll';

export const Player = () => {
  const { playerOpen } = usePlayerContext();
  usePreventBodyScroll(playerOpen);

  if (!playerOpen) {
    return null;
  }

  return (
    <Layout>
      <div></div>
    </Layout>
  );
};
