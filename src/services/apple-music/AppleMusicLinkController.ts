import { load } from 'cheerio';
import levenshtein from 'fast-levenshtein';

import type {
  GetBasicTrackDetailsResponse,
  GetLinkInput,
  MusicServiceLinkController
} from '~services/MusicServiceLinkController';
import type { ValueOrPromise } from '~types';
import type { MusicKit, NativeAppleMusicMediaItem } from '~types/AppleMusic';

declare let window: Window & {
  MusicKit: { getInstance: () => MusicKit };
};

interface SearchResult {
  link: string;
  name: string;
  artistName: string;
}

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

  async getLink(basicTrackDetails: GetLinkInput): Promise<string | null> {
    const searchResults = await this._search(
      `${basicTrackDetails.name} ${basicTrackDetails.artistName}`
    );
    const selectedTrack = this._selectTrack(searchResults, basicTrackDetails);

    if (!selectedTrack) {
      return null;
    }

    return selectedTrack.link;
  }

  private async _getTrack(
    id: string
  ): Promise<NativeAppleMusicMediaItem | null> {
    const musicKit = window.MusicKit.getInstance();
    const track = await musicKit.api.song(id);

    return track;
  }

  private async _search(query: string): Promise<SearchResult[]> {
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

  private _selectTrack(
    tracks: SearchResult[],
    basicTrackDetails: GetLinkInput
  ): SearchResult | null {
    const nonNullTrackOptions = tracks.filter((track) => track !== null);

    if (nonNullTrackOptions.length === 0) {
      return null;
    }

    const matchScores = nonNullTrackOptions.map((track) => {
      const titleScore = levenshtein.get(
        this._sanitizeTitle(basicTrackDetails.name),
        this._sanitizeTitle(track.name)
      );
      const artistScore = levenshtein.get(
        basicTrackDetails.artistName,
        track.artistName
      );
      return titleScore + artistScore;
    });

    const minScore = Math.min(...matchScores);

    if (minScore > 5) {
      return null;
    }

    const bestMatchIndex = matchScores.findIndex((score) => score === minScore);

    return nonNullTrackOptions[bestMatchIndex];
  }

  private _sanitizeTitle(title: string): string {
    return title.replace(/ *\([^)]*\) */g, '').replace(/ *\[[^)]*\] */g, '');
  }
}
