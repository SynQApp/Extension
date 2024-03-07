import levenshtein from 'fast-levenshtein';

import type { LinkType } from './link';

interface MatchSearchResult {
  albumName?: string;
  artistName: string;
  trackName?: string;
  duration?: number;
  link: string;
  linkType: LinkType;
}

type MatchSearchResultWithoutLink = Omit<MatchSearchResult, 'link'>;

const MAX_MILLISECONDS_DURATION_DIFFERNCE = 5000;
const MINIMUM_SCORE = 80;

const TRACK_ATTR_WEIGHT_MAP = new Map<keyof MatchSearchResult, number>([
  ['albumName', 10],
  ['artistName', 45],
  ['trackName', 45]
]);

const ALBUM_ATTR_WEIGHT_MAP = new Map<keyof MatchSearchResult, number>([
  ['artistName', 40],
  ['albumName', 60]
]);

const ARTIST_ATTR_WEIGHT_MAP = new Map<keyof MatchSearchResult, number>([
  ['artistName', 100]
]);

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

export const getBestMatch = (
  sourceResult: MatchSearchResultWithoutLink,
  destinationResults: MatchSearchResult[]
) => {
  const scoredDestinationResults = destinationResults.map((destinationResult) =>
    getMatchScore(sourceResult, destinationResult, destinationResult.linkType)
  );

  return destinationResults[
    scoredDestinationResults.indexOf(Math.max(...scoredDestinationResults))
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
export const getMatchScore = (
  sourceResult: MatchSearchResultWithoutLink,
  destinationResult: MatchSearchResult,
  type: LinkType
): number => {
  let score: number = 0;

  // If the difference in duration exceeds the threshold return a score of 0
  if (
    sourceResult.duration &&
    destinationResult.duration &&
    Math.abs(sourceResult.duration - destinationResult.duration) >
      MAX_MILLISECONDS_DURATION_DIFFERNCE
  ) {
    return 0;
  }

  const weightMap =
    type === 'TRACK'
      ? TRACK_ATTR_WEIGHT_MAP
      : type === 'ALBUM'
      ? ALBUM_ATTR_WEIGHT_MAP
      : ARTIST_ATTR_WEIGHT_MAP;

  for (const [attribute, weight] of weightMap) {
    // This iterates through the scope map and adds the weight * score for each pair of attributes
    score +=
      weight *
      getScoreForAttribute(
        (sourceResult as any)[attribute],
        (destinationResult as any)[attribute]
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
  if (!sourceName || !destinationName) {
    return 100;
  }

  // Convert array based attributes to joined strings
  if (Array.isArray(sourceName)) {
    sourceName = sourceName.sort().join(' ');
  }

  if (Array.isArray(destinationName)) {
    destinationName = destinationName.sort().join(' ');
  }

  // Only parse names and remove feature Arists where applicable
  sourceName = parseNameForFeaturedArtists(sourceName);
  destinationName = parseNameForFeaturedArtists(destinationName);

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
