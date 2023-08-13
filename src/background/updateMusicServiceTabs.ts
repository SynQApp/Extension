import { broadcast } from '@plasmohq/messaging/pub-sub';

import { store } from '~store';
import { clearMusicServiceTabs } from '~store/slices/musicServiceTabs';
import { TabsMessage } from '~types/TabsMessage';

export const updateMusicServiceTabs = () => {
  store.dispatch(clearMusicServiceTabs());

  broadcast({
    payload: { name: TabsMessage.UPDATE_TAB }
  });
};
