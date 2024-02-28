import { SpotifyApi } from '@spotify/web-api-ts-sdk';

let spotifyApi: SpotifyApi | null = null;

export const getSpotifyApi = () => {
  if (!spotifyApi) {
    spotifyApi = SpotifyApi.withUserAuthorization(
      process.env.PLASMO_PUBLIC_SPOTIFY_CLIENT_ID!,
      process.env.PLASMO_PUBLIC_SPOTIFY_CONNECTOR_URI!,
      [
        'streaming',
        'user-read-email',
        'user-read-private',
        'user-read-playback-state',
        'user-library-read',
        'user-library-modify'
      ]
    );
  }

  return spotifyApi;
};
