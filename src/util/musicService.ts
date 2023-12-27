import type { MusicService } from '@synq/music-service-clients';

const URL_MUSIC_SERVICE_MAP: Record<string, MusicService> = {
  apple: 'APPLEMUSIC',
  spotify: 'SPOTIFY',
  youtube: 'YOUTUBEMUSIC',
  amazon: 'AMAZONMUSIC',
  // Spotify connector hosted on synqapp.io/spotify/connector
  synqapp: 'SPOTIFY'
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

const MUSIC_SERVICE_NAME_MAP: Record<MusicService, string> = {
  APPLEMUSIC: 'Apple Music',
  SPOTIFY: 'Spotify',
  YOUTUBEMUSIC: 'YouTube Music',
  AMAZONMUSIC: 'Amazon Music',
  DEEZER: 'Deezer'
};

export const getMusicServiceName = (musicService: MusicService): string => {
  return MUSIC_SERVICE_NAME_MAP[musicService];
};

export const getMusicServiceNameFromUrl = (url: string): string | null => {
  const musicService = getMusicServiceFromUrl(url);

  if (musicService) {
    return getMusicServiceName(musicService);
  }

  return null;
};
