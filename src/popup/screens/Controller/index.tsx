import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import useControllerScreen from './useControllerScreen';

const ControllerScreen = () => {
  useControllerScreen();

  return (
    <div>
      <h1>Controller</h1>
    </div>
  );
};

export default ControllerScreen;
