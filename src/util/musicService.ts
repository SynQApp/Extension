import { MusicService } from '~types/MusicService';

const URL_MUSIC_SERVICE_MAP: Record<string, MusicService> = {
  apple: MusicService.APPLE_MUSIC,
  spotify: MusicService.SPOTIFY,
  youtube: MusicService.YOUTUBE_MUSIC,
  amazon: MusicService.AMAZON_MUSIC
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
  [MusicService.APPLE_MUSIC]: 'Apple Music',
  [MusicService.SPOTIFY]: 'Spotify',
  [MusicService.YOUTUBE_MUSIC]: 'YouTube Music',
  [MusicService.AMAZON_MUSIC]: 'Amazon Music'
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
