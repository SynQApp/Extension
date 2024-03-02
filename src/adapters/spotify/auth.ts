import { SpotifyEndpoints } from '~adapters/spotify/constants';

export const getAuthorizationToken = async (): Promise<string> => {
  const response = await fetch(
    `${SpotifyEndpoints.GET_AUTH_TOKEN}?reason=transport&productType=web_player`,
    {
      credentials: 'include'
    }
  );
  const json = await response.json();
  return json.accessToken;
};
