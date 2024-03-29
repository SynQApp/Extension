import adapters from '~adapters';
import type { MusicService } from '~types';

import { matchAdapter } from '../adapter/register';

export const LinkType = {
  ALBUM: 'ALBUM',
  ARTIST: 'ARTIST',
  TRACK: 'TRACK'
} as const;

export type LinkType = (typeof LinkType)[keyof typeof LinkType];

export interface ParsedLink {
  musicService: MusicService;
  trackId?: string;
  artistId?: string;
  albumId?: string;
  type: LinkType;
}

/**
 * Creates a string link from a parsed link. Cannot be used within ContentControllers.
 * @param link
 * @returns
 */
export const getLink = (link: ParsedLink): string => {
  const { musicService } = link;

  const adapter = adapters.find((adapter) => adapter.id === musicService);

  if (!adapter) {
    throw new Error(`No parser for ${musicService}`);
  }

  const backgroundController = adapter.backgroundController();
  return backgroundController.getLink(link);
};

/**
 * Parses a string link into structured. Cannot be used within ContentControllers.
 * @param link
 * @returns
 */
export const parseLink = (link: string): ParsedLink | null => {
  const adapter = matchAdapter(link, adapters);

  if (!adapter) {
    throw new Error(`No parser for ${link}`);
  }

  const backgroundController = adapter.backgroundController();
  return backgroundController.parseLink(link);
};
