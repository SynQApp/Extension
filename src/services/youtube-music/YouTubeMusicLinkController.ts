import levenshtein from 'fast-levenshtein';

import type {
  GetBasicTrackDetailsResponse,
  GetLinkInput,
  MusicServiceLinkController
} from '~services/MusicServiceLinkController';
import type { Track } from '~types';
import { waitForElement } from '~util/waitForElement';

import { YouTubeMusicPlaybackController } from './YouTubeMusicPlaybackController';

const SEARCH_ENDPOINT = 'https://music.youtube.com/search';
const WATCH_ENDPOINT = 'https://music.youtube.com/watch';

type PartialTrack = Pick<Track, 'name' | 'artistName' | 'albumName' | 'id'>;

export class YouTubeMusicLinkController implements MusicServiceLinkController {
  private _ytmMusicPlaybackController: YouTubeMusicPlaybackController;

  constructor() {
    this._ytmMusicPlaybackController = new YouTubeMusicPlaybackController();
  }

  async getBasicTrackDetails(): Promise<GetBasicTrackDetailsResponse> {
    await waitForElement('.title.ytmusic-player-bar');

    const track = this._ytmMusicPlaybackController.getCurrentTrack();

    if (!track) {
      return null;
    }

    return track;
  }

  async getLink(basicTrackDetails: GetLinkInput): Promise<string | null> {
    const query = `${basicTrackDetails.name} ${basicTrackDetails.artistName}`;

    const htmlResponse = await this._getSearchPage(query);
    const trackOptions = this._extractTrackOptions(htmlResponse);
    const track = this._selectTrack(
      trackOptions,
      basicTrackDetails.name,
      basicTrackDetails.artistName
    );

    if (!track) {
      return null;
    }

    return `${WATCH_ENDPOINT}?v=${track.id}`;
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

  private _selectTrack(
    trackOptions: (PartialTrack | null)[],
    name: string,
    artistName: string
  ): PartialTrack | null {
    const nonNullTrackOptions = trackOptions.filter(
      (track) => track !== null
    ) as PartialTrack[];

    if (nonNullTrackOptions.length === 0) {
      return null;
    }

    const matchScores = nonNullTrackOptions.map((track) => {
      const titleScore = levenshtein.get(
        this._sanitizeTitle(name),
        this._sanitizeTitle(track.name)
      );
      const artistScore = levenshtein.get(artistName, track.artistName);
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
