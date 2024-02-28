import 'https://sdk.scdn.co/spotify-player.js';

import { createContext, useContext, useEffect, useState } from 'react';

import { createMusicControllerHandler } from '~contents/lib/message-handlers/createMusicControllerHandler';
import { createObserverEmitterHandler } from '~contents/lib/message-handlers/createObserverEmitterHandler';
import { createTabsHandler } from '~contents/lib/message-handlers/createTabsHandler';
import { createNotificationObserverHandler } from '~contents/lib/observer-handlers/notificationObserverHandler';
import { SpotifyDesktopController } from '~services/spotify-desktop/SpotifyDesktopController';
import { SpotifyDesktopObserver } from '~services/spotify-desktop/SpotifyDesktopObserver';
import { getSpotifyApi } from '~services/spotify/spotify';
import { useAppDispatch } from '~store';
import { connectToReduxHub } from '~util/connectToReduxHub';

const SYNQ_PLAYER_NAME = 'SynQ Player';
const MAX_RETRIES = 20;

interface SpotifyPlayerContextValue {
  deviceId?: string;
  player?: Spotify.Player;
  error?: string;
}

const SpotifyPlayerContext = createContext<SpotifyPlayerContextValue>({});

interface SpotifyPlayerProviderProps {
  children: React.ReactNode;
  extensionId: string;
}

let spotfiyPlayerReady = false;

window.onSpotifyWebPlaybackSDKReady = () => {
  spotfiyPlayerReady = true;
};

export const SpotifyPlayerProvider = ({
  children,
  extensionId
}: SpotifyPlayerProviderProps) => {
  const [player, setPlayer] = useState<Spotify.Player>();
  const [deviceId, setDeviceId] = useState<string>('');
  const [error, setError] = useState<string>('');
  const dispatch = useAppDispatch();

  useEffect(() => {
    const setup = async () => {
      const spotifyApi = getSpotifyApi();

      const authResponse = await spotifyApi.authenticate();

      if (!authResponse.authenticated) {
        console.error('Failed to authenticate with Spotify');
      }

      let count = 0;

      const interval = setInterval(async () => {
        if (!spotfiyPlayerReady) {
          count++;
          if (count > MAX_RETRIES) {
            console.error('Failed to load Spotify Player');
            return;
          }
          return;
        }

        clearInterval(interval);

        const newPlayer = new window.Spotify.Player({
          name: SYNQ_PLAYER_NAME,
          getOAuthToken: (cb: any) => {
            cb(authResponse.accessToken.access_token);
          },
          volume: 0.5
        });

        newPlayer.on('ready', async ({ device_id }: any) => {
          await spotifyApi.player.transferPlayback([device_id]);
          setDeviceId(device_id);
          console.info('Ready with Device ID', device_id);
        });

        newPlayer.on('account_error', (e: any) => {
          console.error('Spotify Account Error', e);
          setError(
            'There was an error with your Spotify account. Note: You must have a Spotify Premium account to use the remote version of Spotify with SynQ.'
          );
        });

        newPlayer.on('initialization_error', (e: any) => {
          console.error('Spotify Initialization Error', e);
          setError(
            'There was an error initializing Spotify playback. Please try again.'
          );
        });

        newPlayer.on('authentication_error', (e: any) => {
          console.error('Spotify Authentication Error', e);
          setError(
            'There was an error authenticating with Spotify. Please try again.'
          );
        });

        newPlayer.on('playback_error', (e: any) => {
          console.error('Spotify Playback Error', e);
          setError(
            'There was an error with Spotify playback. Please try again.'
          );
        });

        const hub = connectToReduxHub(extensionId);

        const controller = new SpotifyDesktopController(newPlayer, spotifyApi);
        const observer = new SpotifyDesktopObserver(
          newPlayer,
          controller,
          hub,
          dispatch
        );

        createMusicControllerHandler(controller, hub);
        createObserverEmitterHandler(observer, hub);
        createTabsHandler(controller, observer, hub);

        observer.observe();
        observer.subscribe(createNotificationObserverHandler(hub));

        await newPlayer.connect();

        setPlayer(newPlayer);
      }, 500);
    };

    setup();
  }, [setPlayer]);

  const value: SpotifyPlayerContextValue = {
    deviceId,
    player,
    error
  };

  return (
    <SpotifyPlayerContext.Provider value={value}>
      {children}
    </SpotifyPlayerContext.Provider>
  );
};

export const useSpotifyPlayer = () => useContext(SpotifyPlayerContext);
