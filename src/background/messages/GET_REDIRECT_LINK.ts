import levenshtein from 'fast-levenshtein';

import type { PlasmoMessaging } from '@plasmohq/messaging';

import type { MusicService } from '~/types';
import adapters from '~adapters';
import type { BackgroundController, TrackSearchResult } from '~core/adapter';
import type { LinkType } from '~core/link';

interface GetRedirectLinkRequest {
  destinationMusicService: MusicService;
  artistName: string;
  trackName?: string;
  albumName?: string;
  duration: number;
  linkType: LinkType;
}

type SearchResultWithoutLink = Omit<TrackSearchResult, 'link'>;

const MAX_MILLISECONDS_DURATION_DIFFERNCE = 5000;
const MINIMUM_SCORE = 80;

const SCORE_MAP = new Map<keyof TrackSearchResult, number>([
  ['albumName', 10],
  ['artistName', 45],
  ['name', 45]
]);

const handler: PlasmoMessaging.MessageHandler<GetRedirectLinkRequest> = async (
  req,
  res
) => {
  if (!req.body) {
    res.send(undefined);
    return;
  }

  const linkRequest = req.body;

  const adapter = adapters.find(
    (adapter) => adapter.id === linkRequest.destinationMusicService
  );
  const backgroundController = adapter?.backgroundController();

  if (!backgroundController) {
    res.send(undefined);
    return;
  }

  if (linkRequest.linkType === 'TRACK') {
    const link = await getTrackRedirectLink(linkRequest, backgroundController);
    res.send(link);
  } else if (linkRequest.linkType === 'ALBUM') {
    const link = await getAlbumRedirectLink(linkRequest, backgroundController);
    res.send(link);
  } else if (linkRequest.linkType === 'ARTIST') {
    const link = await getArtistRedirectLink(linkRequest, backgroundController);
    res.send(link);
  }
};

export default handler;

const getTrackRedirectLink = async (
  linkRequest: GetRedirectLinkRequest,
  backgroundController: BackgroundController
) => {
  if (!linkRequest.trackName) {
    return undefined;
  }

  const searchResults = await backgroundController.searchTracks({
    artistName: linkRequest.artistName,
    name: linkRequest.trackName,
    albumName: linkRequest.albumName,
    duration: linkRequest.duration
  });

  const bestResult = getBestTrackMatch(
    {
      name: linkRequest.trackName,
      artistName: linkRequest.artistName,
      albumName: linkRequest.albumName,
      duration: linkRequest.duration
    },
    searchResults
  );

  return bestResult.link;
};

const getAlbumRedirectLink = async (
  linkRequest: GetRedirectLinkRequest,
  backgroundController: BackgroundController
) => {
  if (!linkRequest.albumName) {
    return undefined;
  }

  const searchResults = await backgroundController.searchAlbums({
    name: linkRequest.albumName,
    artistName: linkRequest.artistName
  });

  if (!searchResults.length) {
    return undefined;
  }

  return searchResults[0].link;
};

const getArtistRedirectLink = async (
  linkRequest: GetRedirectLinkRequest,
  backgroundController: BackgroundController
) => {
  const searchResults = await backgroundController.searchArtists({
    name: linkRequest.artistName
  });

  if (!searchResults.length) {
    return undefined;
  }

  return searchResults[0].link;
};

/**
 * Returns a normalized Levenshtein score between 0 and 1 on an exponential scale,
 * rather than a pure edit distance.
 * This is a measure of the similarity between two strings.
 *
 * @param firstString - the first string
 * @param secondString - the second string
 * @returns the normalized Levenshtein score
 *
 */
export const getLevenshteinScore = (
  firstString: string,
  secondString: string
): number => {
  // If the first string and second string are equal, even if empty, return 1 as a perfect match
  if (firstString === secondString) {
    return 1;
  }

  // If either string is empty, but not both, return 0
  if (!firstString || !secondString) {
    return 0;
  }

  return Math.max(
    (firstString.length -
      Math.pow(levenshtein.get(firstString, secondString), 2)) /
      firstString.length,
    0
  );
};

export const getBestTrackMatch = (
  sourceTrack: SearchResultWithoutLink,
  destinationTracks: TrackSearchResult[]
): TrackSearchResult => {
  // Score each of the destination songs
  const scoredDestinationSongs = destinationTracks.map((_) =>
    getTrackScore(sourceTrack, _)
  );

  // Return the best scoring song
  return destinationTracks[
    scoredDestinationSongs.indexOf(Math.max(...scoredDestinationSongs))
  ];
};

/**
 * Returns a 0 - 100 score for a possible translation match.
 *
 * Songs that have a difference in duration greater than the max return 0.
 * Scores that do not meet the minimum threshold also return 0.
 *
 * @param sourceTrack - the original song for translation
 * @param destinationTrack - a possible candidate in the target player
 * @returns a score defining the match
 *
 */
export const getTrackScore = (
  sourceTrack: SearchResultWithoutLink,
  destinationTrack: TrackSearchResult
): number => {
  let score: number = 0;

  // If the difference in duration exceeds the threshold return a score of 0
  if (
    sourceTrack.duration &&
    destinationTrack.duration &&
    Math.abs(sourceTrack.duration - destinationTrack.duration) >
      MAX_MILLISECONDS_DURATION_DIFFERNCE
  ) {
    return 0;
  }

  for (const [attribute, weight] of SCORE_MAP) {
    // This iterates through the scope map and adds the weight * score for each pair of attributes
    score +=
      weight *
      getScoreForAttribute(
        (sourceTrack as any)[attribute],
        (destinationTrack as any)[attribute]
      );
  }

  // Only return scores that are greater than the minimum required score
  return score >= MINIMUM_SCORE ? score : 0;
};

/**
 * Returns a 0 - 100 score on the match of a particular attribute set.
 *
 * @param sourceName - the name value of the original song for translation
 * @param destinationName - the name value of a possible candidate in the target player
 * @param willParseNameForFeaturedArtists - whether or not to parse the inputs for featured artist information
 * @returns a score defining the match quality of the particular attribute
 *
 */
export const getScoreForAttribute = (
  sourceName: string | Array<string>,
  destinationName: string | Array<string>
): number => {
  // Convert array based attributes to joined strings
  if (Array.isArray(sourceName)) {
    sourceName = sourceName.sort().join(' ');
  }

  if (Array.isArray(destinationName)) {
    destinationName = destinationName.sort().join(' ');
  }

  // Only parse names and remove feature Arists where applicable
  // sourceName = parseNameForFeaturedArtists(sourceName);
  // destinationName = parseNameForFeaturedArtists(destinationName);

  return getLevenshteinScore(sourceName, destinationName);
};

/**
 * Removes featured artist information from named attributes.
 *
 * @param name - generic string for song, album, and artist names
 * @returns the original name less any featured artist information
 *
 */
export const parseNameForFeaturedArtists = (name: string): string => {
  // The featureRegex will match any combination of feature and with in parenthesis.
  let featureRegex: RegExp = /\s+\(?(f(ea)?t(ure|uring)?|with)\.?.*\)?/;
  return name.replace(featureRegex, '');
};
