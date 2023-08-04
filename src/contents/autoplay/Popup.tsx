import { Button, Text, token } from '@synq/ui';
import { useEffect, useState } from 'react';
import { styled } from 'styled-components';

import { AutoplayMessageType } from '~types/AutoplayMessageType';
import { ContentEvent } from '~types/ContentEvent';
import { ControllerMessageType } from '~types/ControllerMessageType';
import { getMusicServiceNameFromUrl } from '~util/musicService';

const Popup = () => {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const handler = (e: CustomEvent) => {
      const message = e.detail.body;

      if (message.name === AutoplayMessageType.DISPLAY_AUTOPLAY_POPUP) {
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
          name: ControllerMessageType.PREPARE_FOR_AUTOPLAY
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
      <Modal>
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

const Modal = styled.div`
  align-items: center;
  background: ${token('colors.surface')};
  border-radius: ${token('radii.lg')};
  display: flex;
  flex-direction: column;
  height: 150px;
  justify-content: center;
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

export default Popup;
