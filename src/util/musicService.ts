import type { MusicService } from '~/types';
import adapters from '~adapters';
import { matchAdapter } from '~core/adapter/register';

export const getMusicServiceFromUrl = (url: string): MusicService | null => {
  const adapter = matchAdapter(url, adapters);
  return adapter?.id ?? null;
};

export const getMusicServiceName = (musicService: MusicService): string => {
  return (
    adapters.find((adapter) => adapter.id === musicService)?.displayName ?? ''
  );
};
