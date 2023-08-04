import './index.css';

import { useEffect } from 'react';

import { POPUP_PORT } from '~constants/port';

import App from './App';

const Popup = () => {
  useEffect(() => {
    chrome.runtime.connect({ name: POPUP_PORT });
  }, []);

  return <App />;
};

export default Popup;
