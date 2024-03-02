import { load } from 'cheerio';

import type {
  MusicKit,
  NativeAppleMusicMediaItem
} from '~adapters/apple-music/types';
import type {
  BackgroundController,
  SearchInput,
  SearchResult
} from '~core/adapter';
import type { ParsedLink } from '~core/link';

import { AppleAdapter } from './AppleAdapter';

declare let window: Window & {
  MusicKit: { getInstance: () => MusicKit };
};

const SEARCH_ENDPOINT = 'https://music.apple.com/us/search';

export class AppleBackgroundController implements BackgroundController {
  async search(basicTrackDetails: SearchInput): Promise<SearchResult[]> {
    const query = `${basicTrackDetails.name} ${basicTrackDetails.artistName}`;

    const htmlResponse = await fetch(
      `${SEARCH_ENDPOINT}?term=${encodeURIComponent(query)}`
    ).then((response) => response.text());

    const $ = load(htmlResponse);
    const songElements = $('.section[aria-label="Songs"] div[role="listitem"]');

    const songs = [...songElements].map((songElement) => {
      const name = $(songElement).find('.track-lockup__title').text().trim();
      const artistName = $(songElement)
        .find('.track-lockup__subtitle')
        .text()
        .trim();
      const link = $(songElement).find('.track-lockup__title a').attr('href');

      if (!name || !artistName || !link) {
        return null;
      }

      return {
        name,
        artistName,
        link
      };
    });

    return songs.filter((song) => song !== null) as SearchResult[];
  }

  public parseLink(link: string): ParsedLink | null {
    const parsedLink: Partial<ParsedLink> = {
      musicService: 'APPLEMUSIC'
    };

    const url = new URL(link);
    const path = url.pathname;
    const pathParts = path.split('/').filter((part) => part !== '');
    const query = url.searchParams;

    if (pathParts[1] === 'album') {
      if (query.has('i')) {
        const trackId = query.get('i');
        parsedLink.trackId = trackId || '';
        parsedLink.type = 'TRACK';
      } else {
        parsedLink.albumId = pathParts[3];
        parsedLink.type = 'ALBUM';
      }
    } else if (pathParts[1] === 'song') {
      parsedLink.trackId = pathParts[3];
      parsedLink.type = 'TRACK';
    } else if (pathParts[1] === 'artist') {
      parsedLink.artistId = pathParts[3];
      parsedLink.type = 'ARTIST';
    }

    return parsedLink.albumId || parsedLink.artistId || parsedLink.trackId
      ? (parsedLink as ParsedLink)
      : null;
  }

  public getLink(parsedLink: ParsedLink): string {
    const { type } = parsedLink;
    const baseUrl = `${AppleAdapter.baseUrl}/us`;

    if (type === 'ALBUM') {
      return `${baseUrl}/album/${parsedLink.albumId}`;
    } else if (type === 'ARTIST') {
      return `${baseUrl}/artist/${parsedLink.artistId}`;
    } else if (type === 'TRACK') {
      return `${baseUrl}/song/${parsedLink.trackId}`;
    } else {
      throw new Error('Invalid link type');
    }
  }
}