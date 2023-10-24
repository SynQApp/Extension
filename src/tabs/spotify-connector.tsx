// import 'https://sdk.scdn.co/spotify-player.js';

import { UiProvider } from '@synq/ui';
import { Provider } from 'react-redux';

import { store } from '~store';
import { SpotifyConnector } from '~ui/spotify-connector/SpotifyConnector';
import { SpotifyPlayerProvider } from '~ui/spotify-connector/SpotifyPlayerContext';

// (window as any).onSpotifyWebPlaybackSDKReady = () => {
//   (window as any).SPOTIFY_PLAYER_READY = true;
// };

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
