import { Button, Flex, Text, token } from '@synq/ui';
import { useEffect, useState } from 'react';
import { styled } from 'styled-components';

import { useAppDispatch } from '~store';
import { updateMusicServiceTabAutoPlayReady } from '~store/slices/musicServiceTabs';
import { MusicControllerMessage } from '~types';
import { useMusicServiceTab } from '~ui/shared/contexts/MusicServiceTab';
import { sendAnalytic } from '~util/analytics';
import { getMusicServiceNameFromUrl } from '~util/musicService';
import { sendMessage } from '~util/sendMessage';

let firstRender = true;

const AutoplayPopup = () => {
  const [showPopup, setShowPopup] = useState(false);
  const dispatch = useAppDispatch();
  const { musicServiceTab } = useMusicServiceTab();

  useEffect(() => {
    if (firstRender) {
      if (!musicServiceTab?.tabId) {
        return;
      }

      dispatch(
        updateMusicServiceTabAutoPlayReady({
          tabId: musicServiceTab.tabId,
          autoPlayReady: true
        })
      );
      firstRender = false;
      return;
    }

    setShowPopup(!musicServiceTab?.autoPlayReady);
  }, [musicServiceTab]);

  const handleEnableClick = () => {
    if (!musicServiceTab?.tabId) {
      return;
    }

    dispatch(
      updateMusicServiceTabAutoPlayReady({
        tabId: musicServiceTab?.tabId,
        autoPlayReady: true
      })
    );

    sendMessage(
      {
        name: MusicControllerMessage.PREPARE_FOR_AUTOPLAY
      },
      musicServiceTab?.tabId
    );

    sendAnalytic({
      name: 'autoplay_enabled'
    });
  };

  const handleOverlayClick = () => {
    setShowPopup(false);
  };

  if (!showPopup) return null;

  return (
    <>
      <PopupOverlay onClick={handleOverlayClick} />
      <Modal align="center" direction="column" justify="center">
        <DescriptionText type="subtitle" size="md" weight="semibold">
          Click the button below to enable SynQ to control{' '}
          {getMusicServiceNameFromUrl(window.location.href)}.
        </DescriptionText>
        <Button onClick={handleEnableClick}>Enable SynQ</Button>
      </Modal>
    </>
  );
};

const PopupOverlay = styled.div`
  background: ${token('colors.base.black')};
  height: 100%;
  opacity: 0.3;
  position: fixed;
  width: 100%;
  z-index: 100;
`;

const Modal = styled(Flex)`
  background: ${token('colors.surface')};
  border-radius: ${token('radii.lg')};
  height: 150px;
  left: calc(50% - 200px);
  padding: ${token('spacing.sm')} ${token('spacing.md')};
  position: fixed;
  top: calc(50% - 75px);
  width: 325px;
  z-index: 101;
`;

const DescriptionText = styled(Text)`
  margin-bottom: ${token('spacing.lg')};
  margin-top: 0;
  text-align: center;
`;

export default AutoplayPopup;
