import type { KeyControlsOptions } from '~lib/key-controls/keyControlsListener';

export const SpotifyEndpoints = {
  CURRENTLY_PLAYING: 'https://api.spotify.com/v1/me/player/currently-playing',
  GET_AUTH_TOKEN: 'https://open.spotify.com/get_access_token',
  GET_QUEUE: 'https://api.spotify.com/v1/me/player/queue',
  IS_IN_LIBRARY: 'https://api.spotify.com/v1/me/tracks/contains',
  MODIFY_LIBRARY: 'https://api.spotify.com/v1/me/tracks',
  NEXT: 'https://api.spotify.com/v1/me/player/next',
  PAUSE: 'https://api.spotify.com/v1/me/player/pause',
  PLAY: 'https://api.spotify.com/v1/me/player/play',
  PLAYER_STATE: 'https://api.spotify.com/v1/me/player',
  PREVIOUS: 'https://api.spotify.com/v1/me/player/previous',
  SEARCH: 'https://api.spotify.com/v1/search',
  SEEK_TO: 'https://api.spotify.com/v1/me/player/seek',
  SET_REPEAT_MODE: 'https://api.spotify.com/v1/me/player/repeat',
  SET_VOLUME: 'https://api.spotify.com/v1/me/player/volume'
};

export const SPOTIFY_KEY_CONTROLS: KeyControlsOptions = {
  next: true,
  previous: true,
  volumeDown: true,
  volumeUp: true
};
