import { load } from 'cheerio';

import type {
  GetBasicTrackDetailsResponse,
  MusicServiceLinkController,
  SearchInput,
  SearchResult
} from '~services/MusicServiceLinkController';
import type { MusicKit, NativeAppleMusicMediaItem } from '~types/AppleMusic';

declare let window: Window & {
  MusicKit: { getInstance: () => MusicKit };
};

const SEARCH_ENDPOINT = 'https://music.apple.com/us/search';

export class AppleMusicLinkController implements MusicServiceLinkController {
  public async getBasicTrackDetails(): Promise<GetBasicTrackDetailsResponse> {
    const params = new URLSearchParams(window.location.search);
    const trackId = params.get('i');

    if (!trackId) {
      return null;
    }

    const track = await this._getTrack(trackId);

    if (!track) {
      return null;
    }

    return {
      name: track.attributes.name,
      artistName: track.attributes.artistName,
      albumName: track.attributes.albumName,
      duration: track.attributes.durationInMillis,
      albumCoverUrl: track.attributes.artwork.url
    };
  }

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

  private async _getTrack(
    id: string
  ): Promise<NativeAppleMusicMediaItem | null> {
    const musicKit = window.MusicKit.getInstance();
    const track = await musicKit.api.song(id);

    return track;
  }
}
