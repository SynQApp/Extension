import { Button, Flex, Text, token } from '@synq/ui';
import { useEffect, useState } from 'react';
import { styled } from 'styled-components';

import { AutoplayMessage, ContentEvent, MusicControllerMessage } from '~types';
import { getMusicServiceNameFromUrl } from '~util/musicService';

const AutoplayPopup = () => {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const handler = (e: CustomEvent) => {
      const message = e.detail.body;

      if (message.name === AutoplayMessage.DISPLAY_AUTOPLAY_POPUP) {
        setShowPopup(true);
      }
    };

    window.addEventListener(ContentEvent.TO_CONTENT, handler);

    return () => {
      window.removeEventListener(ContentEvent.TO_CONTENT, handler);
    };
  }, []);

  const handleEnableClick = () => {
    setShowPopup(false);

    const event = new CustomEvent(ContentEvent.TO_CONTENT, {
      detail: {
        body: {
          name: MusicControllerMessage.PREPARE_FOR_AUTOPLAY
        }
      }
    });

    window.dispatchEvent(event);
  };

  const handleOverlayClick = () => {
    setShowPopup(false);
  };

  if (!showPopup) return null;

  return (
    <>
      <PopupOverlay onClick={handleOverlayClick} />
      <Modal align="center" direction="column" justify="center">
        <DescriptionText type="subtitle" size="md">
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
  padding: ${token('spacing.lg')};
  position: fixed;
  top: calc(50% - 75px);
  width: 400px;
  z-index: 101;
`;

const DescriptionText = styled(Text)`
  margin-bottom: ${token('spacing.lg')};
  margin-top: 0;
  text-align: center;
`;

export default AutoplayPopup;
