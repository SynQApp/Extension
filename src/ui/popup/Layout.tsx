import { token } from '@synq/ui';
import { styled } from 'styled-components';

import { useAppDispatch } from '~store';
import { updateMusicServiceTabPictureInPicture } from '~store/slices/musicServiceTabs';
import { useMusicServiceTab } from '~ui/shared/contexts/MusicServiceTab';

import Header from '../shared/components/Header';

interface LayoutProps {
  children: React.ReactNode;
  hideButton?: boolean;
}

const Layout = ({ children, hideButton }: LayoutProps) => {
  const { musicServiceTab } = useMusicServiceTab();
  const dispatch = useAppDispatch();

  return (
    <Container>
      <Header
        actionButton={
          !hideButton
            ? {
                name: 'Share',
                // TODO: Implement session start handler
                onClick: () =>
                  musicServiceTab?.tabId &&
                  dispatch(
                    updateMusicServiceTabPictureInPicture({
                      tabId: musicServiceTab?.tabId,
                      pictureInPicture: !musicServiceTab?.pictureInPicture
                    })
                  )
              }
            : undefined
        }
      />
      <Content>{children}</Content>
    </Container>
  );
};

const Container = styled.div`
  background: ${token('colors.background')};
  transition: all 0.2s ease-in-out;
  width: 350px;
`;

const Content = styled.div`
  width: 100%;
  height: calc(100% - 50px);
`;

export default Layout;
