import './index.css';

import { useEffect } from 'react';

import App from './App';

const Popup = () => {
  useEffect(() => {
    chrome.runtime.connect({ name: 'popup' });
  }, []);

  return <App />;
};

export default Popup;
