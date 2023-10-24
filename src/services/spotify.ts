import { SpotifyApi } from '@spotify/web-api-ts-sdk';

let spotifyApi: SpotifyApi | null = null;

export const getSpotifyApi = () => {
  if (!spotifyApi) {
    spotifyApi = SpotifyApi.withUserAuthorization(
      process.env.PLASMO_PUBLIC_SPOTIFY_CLIENT_ID!,
      'http://localhost:3000/spotify/connector',
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
