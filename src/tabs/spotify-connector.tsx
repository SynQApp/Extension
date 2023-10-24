import { UiProvider } from '@synq/ui';
import { Provider } from 'react-redux';

import { store } from '~store';
import { SpotifyConnector } from '~ui/spotify-connector/SpotifyConnector';
import { SpotifyPlayerProvider } from '~ui/spotify-connector/SpotifyPlayerContext';

const SpotifyConnectorEntry = () => {
  return (
    <UiProvider>
      <Provider store={store}>
        <SpotifyPlayerProvider>
          <SpotifyConnector />
        </SpotifyPlayerProvider>
      </Provider>
    </UiProvider>
  );
};

export default SpotifyConnectorEntry;
