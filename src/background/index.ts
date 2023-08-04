import { startHub } from '@plasmohq/messaging/pub-sub';

import { popupListener } from './popupListener';

startHub();
popupListener();
