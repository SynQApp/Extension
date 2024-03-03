import type {
  AlbumSearchResult,
  ArtistSearchResult,
  BackgroundController,
  SearchAlbumsInput,
  SearchArtistsInput,
  SearchTracksInput,
  TrackSearchResult
} from '~core/adapter';
import type { ParsedLink } from '~core/link';
import type { Track, ValueOrPromise } from '~types';

import { YouTubeMusicAdapter } from './YouTubeMusicAdapter';

const SEARCH_ENDPOINT = 'https://music.youtube.com/search';
const WATCH_ENDPOINT = 'https://music.youtube.com/watch';

type PartialTrack = Pick<Track, 'name' | 'artistName' | 'albumName' | 'id'>;

export class YouTubeMusicBackgroundController implements BackgroundController {
  async searchTracks(
    basicTrackDetails: SearchTracksInput
  ): Promise<TrackSearchResult[]> {
    const query = `${basicTrackDetails.name} ${basicTrackDetails.artistName}`;

    const htmlResponse = await this._getSearchPage(query);
    const trackOptions = this._extractTrackOptions(htmlResponse);
    const searchResults = trackOptions
      .map((track) => {
        if (!track) {
          return null;
        }

        return {
          link: `${WATCH_ENDPOINT}?v=${track.id}`,
          name: track.name,
          artistName: track.artistName,
          duration: basicTrackDetails.duration,
          albumName: basicTrackDetails.albumName
        };
      })
      .filter((track) => track !== null) as TrackSearchResult[];

    return searchResults;
  }

  searchAlbums(
    searchInput: SearchAlbumsInput
  ): ValueOrPromise<AlbumSearchResult[]> {
    throw new Error('Method not implemented.');
  }

  searchArtists(
    searchInput: SearchArtistsInput
  ): ValueOrPromise<ArtistSearchResult[]> {
    throw new Error('Method not implemented.');
  }

  public getLink(parsedLink: ParsedLink): string {
    const { type } = parsedLink;
    const baseUrl = YouTubeMusicAdapter.baseUrl;

    if (type === 'ALBUM') {
      return `${baseUrl}/playlist?list=${parsedLink.albumId}`;
    } else if (type === 'ARTIST') {
      return `${baseUrl}/channel/${parsedLink.artistId}`;
    } else if (type === 'TRACK') {
      return `${baseUrl}/watch?v=${parsedLink.trackId}`;
    } else {
      throw new Error('Invalid link type');
    }
  }

  public parseLink(link: string): ParsedLink | null {
    const parsedLink: Partial<ParsedLink> = {
      musicService: 'YOUTUBEMUSIC'
    };

    const url = new URL(link);
    const path = url.pathname;
    const pathParts = path.split('/').filter((part) => part !== '');
    const query = url.searchParams;

    if (pathParts[0] === 'watch') {
      parsedLink.trackId = query.get('v') || '';
      parsedLink.type = 'TRACK';
    } else if (pathParts[0] === 'playlist') {
      parsedLink.albumId = query.get('list') || '';
      parsedLink.type = 'ALBUM';
    } else if (pathParts[0] === 'channel') {
      parsedLink.artistId = pathParts[1];
      parsedLink.type = 'ARTIST';
    }

    return parsedLink.albumId || parsedLink.artistId || parsedLink.trackId
      ? (parsedLink as ParsedLink)
      : null;
  }

  private async _getSearchPage(query: string): Promise<string> {
    const htmlResponse = await fetch(
      `${SEARCH_ENDPOINT}?q=${encodeURI(query)}`,
      {
        credentials: 'omit'
      }
    ).then((res) => res.text());

    return htmlResponse;
  }

  private _extractTrackOptions(text: string): (PartialTrack | null)[] {
    const regex = /search',.*data\: '(.*)'\}\)\;ytcfg/;
    const matches = text.match(regex);
    let match = matches?.[1];

    if (!match) {
      return [];
    }

    match = match.replace(/\\x/g, '%');
    let decodedMatch = decodeURIComponent(match);
    decodedMatch = decodedMatch.replace(/\\\"/g, '"');

    let parsedMatch: any = {};

    try {
      parsedMatch = JSON.parse(decodedMatch);
    } catch (e) {
      console.info("Couldn't parse JSON");
      console.error(e);
      return [];
    }

    const firstTrack = this._getFirstTack(parsedMatch);
    const topResultTrack = this._getTopResultTack(parsedMatch);

    return [firstTrack, topResultTrack];
  }

  private _getTopResultTack(apiResult: any): PartialTrack | null {
    const resultTrack =
      apiResult.contents?.tabbedSearchResultsRenderer?.tabs?.[0]?.tabRenderer
        ?.content?.sectionListRenderer?.contents?.[0]?.musicCardShelfRenderer;

    if (!resultTrack) {
      return null;
    }

    const name = resultTrack.title?.runs?.[0]?.text;
    const artistName = resultTrack.subtitle?.runs?.[2]?.text;
    const albumName = resultTrack.subtitle?.runs?.[4]?.text;
    const id = resultTrack.onTap?.watchEndpoint?.videoId;

    if (!id) {
      return null;
    }

    return {
      name,
      artistName,
      albumName,
      id
    };
  }

  private _getFirstTack(apiResult: any): PartialTrack | null {
    const sectionsList =
      apiResult.contents?.tabbedSearchResultsRenderer?.tabs?.[0]?.tabRenderer
        ?.content?.sectionListRenderer?.contents;

    if (!sectionsList) {
      return null;
    }

    const resultTrack = sectionsList.find(
      (section: any) =>
        section?.musicShelfRenderer?.title?.runs?.[0]?.text === 'Songs'
    )?.musicShelfRenderer?.contents?.[0]?.musicResponsiveListItemRenderer;

    if (!resultTrack) {
      return null;
    }

    const titleObj =
      resultTrack.flexColumns?.[0]?.musicResponsiveListItemFlexColumnRenderer
        ?.text?.runs?.[0];
    const name = titleObj?.text;
    const id = titleObj?.navigationEndpoint?.watchEndpoint?.videoId;

    const subtitleRuns =
      resultTrack.flexColumns?.[1]?.musicResponsiveListItemFlexColumnRenderer
        ?.text?.runs;
    const artistName = subtitleRuns?.[2]?.text;
    const albumName = subtitleRuns?.[4]?.text;

    if (!id) {
      return null;
    }

    return {
      name,
      artistName,
      albumName,
      id
    };
  }
}
