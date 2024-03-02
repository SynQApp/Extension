import { Button, UiProvider } from '@synq/ui';
import type { PlasmoCSConfig, PlasmoCSUIProps, PlasmoGetStyle } from 'plasmo';
import { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';

import { sendToContent } from '~core/messaging/sendToContent';
import { store } from '~store';
import { UiStateMessage } from '~types';
import { PipToggleButton } from '~ui/pip/PipToggleButton';
import { PipUi } from '~ui/pip/PipUi';
import { sendAnalytic } from '~util/analytics';

declare let window: {
  documentPictureInPicture?: {
    requestWindow: (options?: {
      width?: number;
      height?: number;
    }) => Promise<Window>;
  };
};

export const config: PlasmoCSConfig = {
  matches: [
    '*://music.apple.com/*',
    '*://open.spotify.com/*',
    '*://music.youtube.com/*',
    '*://music.amazon.com/*'
  ],
  all_frames: true
};

export const getRootContainer = () => {
  const container = document.createElement('div');
  container.setAttribute('id', 'synq-pip-container');
  container.style.position = 'fixed';
  container.style.top = '120px';
  container.style.right = '0';
  container.style.zIndex = '99';

  document.body.append(container);

  const style = document.createElement('style');
  style.innerHTML = `
  #synq-pip-container > .plasmo-csui-container {
    position: unset !important;
  }
  `;

  document.head.append(style);

  return container;
};

const PipTriggerUi = ({ anchor }: PlasmoCSUIProps) => {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    if (window?.documentPictureInPicture) {
      setShowButton(true);
    }
  }, []);

  const handleButtonClick = async () => {
    const pipWindow = await window.documentPictureInPicture?.requestWindow({
      width: 350,
      height: 350
    });

    if (!pipWindow) return;

    const container = pipWindow.document.createElement('div');
    pipWindow.document.body.append(container);

    const pipRoot = createRoot(container);
    pipRoot.render(
      <UiProvider>
        <PipUi pipDocument={pipWindow.document} />
      </UiProvider>
    );

    sendToContent({
      name: UiStateMessage.PIP_OPENED
    });

    setShowButton(false);

    sendAnalytic({ name: 'pip_opened' });

    pipWindow.addEventListener('pagehide', () => {
      sendToContent({
        name: UiStateMessage.PIP_CLOSED
      });

      setShowButton(true);

      sendAnalytic({ name: 'pip_closed' });
    });
  };

  return (
    <Provider store={store}>
      <UiProvider>
        {showButton && <PipToggleButton onClick={handleButtonClick} />}
      </UiProvider>
    </Provider>
  );
};

export default PipTriggerUi;
