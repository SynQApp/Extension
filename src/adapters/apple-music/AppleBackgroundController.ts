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
}
