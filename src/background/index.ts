import { startHub } from '@plasmohq/messaging/pub-sub';

import { popupListener } from './popupListener';
import { registerHubMessageHandlers } from './registerHubMessageHandlers';

popupListener();
startHub();

registerHubMessageHandlers();
