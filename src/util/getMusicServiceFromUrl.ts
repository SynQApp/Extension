export type MusicService =
  | 'Apple Music'
  | 'Spotify'
  | 'YouTube Music'
  | 'Amazon Music';

const URL_MUSIC_SERVICE_MAP: Record<string, MusicService> = {
  apple: 'Apple Music',
  spotify: 'Spotify',
  youtube: 'YouTube Music',
  amazon: 'Amazon Music'
};

export const getMusicServiceFromUrl = (url: string): MusicService | null => {
  const urlObject = new URL(url);
  const hostname = urlObject.hostname;

  for (const [key, value] of Object.entries(URL_MUSIC_SERVICE_MAP)) {
    if (hostname.includes(key)) {
      return value;
    }
  }

  return null;
};
