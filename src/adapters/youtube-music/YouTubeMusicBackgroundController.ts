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

import { YouTubeMusicAdapter } from './YouTubeMusicAdapter';
import type {
  YtmSearchApiResult,
  YtmSearchApiResultMusicShelfRenderer
} from './types';

const SEARCH_ENDPOINT = 'https://music.youtube.com/search';
const WATCH_ENDPOINT = 'https://music.youtube.com/watch';
const BROWSE_ENDPOINT = 'https://music.youtube.com/browse';

export class YouTubeMusicBackgroundController implements BackgroundController {
  async searchTracks(
    basicTrackDetails: SearchTracksInput
  ): Promise<TrackSearchResult[]> {
    const query = `${basicTrackDetails.name} ${basicTrackDetails.artistName}`;

    const apiSearchResult = await this._search(query);

    if (!apiSearchResult) {
      return [];
    }

    const trackOptions = this._extractTrackOptions(apiSearchResult).filter(
      (option) => option !== null
    ) as TrackSearchResult[];

    return trackOptions;
  }

  public async searchAlbums(
    searchInput: SearchAlbumsInput
  ): Promise<AlbumSearchResult[]> {
    const query = `${searchInput.name} ${searchInput.artistName}`;

    const apiSearchResult = await this._search(query);

    if (!apiSearchResult) {
      return [];
    }

    const albumOptions = this._extractAlbumOptions(apiSearchResult).filter(
      (album) => album !== null
    ) as AlbumSearchResult[];

    return albumOptions;
  }

  public async searchArtists(
    searchInput: SearchArtistsInput
  ): Promise<ArtistSearchResult[]> {
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

  private async _search(
    query: string
  ): Promise<YtmSearchApiResult | undefined> {
    const htmlResponse = await fetch(
      `${SEARCH_ENDPOINT}?q=${encodeURI(query)}`,
      {
        credentials: 'omit'
      }
    ).then((res) => res.text());

    const regex = /search',.*data\: '(.*)'\}\)\;ytcfg/;
    const matches = htmlResponse.match(regex);
    let match = matches?.[1];

    if (!match) {
      return undefined;
    }

    match = match.replace(/\\x/g, '%');
    let decodedMatch = decodeURIComponent(match);
    decodedMatch = decodedMatch.replace(/\\\"/g, '"');

    let parsedMatch: any = {};

    try {
      parsedMatch = JSON.parse(decodedMatch);
      return parsedMatch;
    } catch (e) {
      return undefined;
    }
  }

  private _extractTrackOptions(
    apiSearchResult: YtmSearchApiResult
  ): (TrackSearchResult | null)[] {
    const topResultTrack = this._getTopResultTrack(apiSearchResult);
    const firstTrack = this._getFirstTrack(apiSearchResult);

    return [topResultTrack, firstTrack];
  }

  private _getTopResultTrack(apiResult: any): TrackSearchResult | null {
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
      link: `${WATCH_ENDPOINT}?v=${id}`
    };
  }

  private _getFirstTrack(apiResult: any): TrackSearchResult | null {
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
      link: `${WATCH_ENDPOINT}?v=${id}`
    };
  }

  private _extractAlbumOptions(
    apiSearchResult: YtmSearchApiResult
  ): (AlbumSearchResult | null)[] {
    const firstAlbum = this._getFirstAlbum(apiSearchResult);
    const topResultAlbum = this._getTopResultAlbum(apiSearchResult);

    return [topResultAlbum, firstAlbum];
  }

  private _getTopResultAlbum(apiResult: any): AlbumSearchResult | null {
    const resultTrack =
      apiResult.contents?.tabbedSearchResultsRenderer?.tabs?.[0]?.tabRenderer
        ?.content?.sectionListRenderer?.contents?.[0]?.musicCardShelfRenderer;

    if (!resultTrack) {
      return null;
    }

    const name = resultTrack.title?.runs?.[0]?.text;
    const artistName = resultTrack.subtitle?.runs?.[2]?.text;
    const id =
      resultTrack.title?.runs?.[0]?.navigationEndpoint?.browseEndpoint
        ?.browseId;

    return {
      name,
      artistName,
      link: `${BROWSE_ENDPOINT}/${id}`
    };
  }

  private _getFirstAlbum(
    apiResult: YtmSearchApiResult
  ): AlbumSearchResult | null {
    const sectionsList = apiResult.contents?.tabbedSearchResultsRenderer
      ?.tabs?.[0]?.tabRenderer?.content?.sectionListRenderer
      ?.contents as YtmSearchApiResultMusicShelfRenderer[];

    if (!sectionsList) {
      return null;
    }

    const resultAlbum = sectionsList.find(
      (section) =>
        section?.musicShelfRenderer?.title?.runs?.[0]?.text === 'Albums'
    )?.musicShelfRenderer?.contents?.[0]?.musicResponsiveListItemRenderer;

    if (!resultAlbum) {
      return null;
    }

    const titleObj =
      resultAlbum.flexColumns?.[0]?.musicResponsiveListItemFlexColumnRenderer
        ?.text?.runs?.[0];
    const name = titleObj?.text;
    const id = resultAlbum.navigationEndpoint?.browseEndpoint?.browseId;

    const subtitleRuns =
      resultAlbum.flexColumns?.[1]?.musicResponsiveListItemFlexColumnRenderer
        ?.text?.runs;
    const artistName = subtitleRuns?.[2]?.text;

    if (!id) {
      return null;
    }

    return {
      name,
      artistName,
      link: `${BROWSE_ENDPOINT}/${id}`
    };
  }
}
