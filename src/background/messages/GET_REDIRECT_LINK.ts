import type { MusicService } from '@synq/music-service-clients';
import levenshtein from 'fast-levenshtein';

import type { PlasmoMessaging } from '@plasmohq/messaging';

import type {
  MusicServiceLinkController,
  SearchResult
} from '~services/MusicServiceLinkController';
import { AmazonMusicController } from '~services/amazon-music/AmazonMusicController';
import { AppleMusicLinkController } from '~services/apple-music/AppleMusicLinkController';
import { SpotifyLinkController } from '~services/spotify/SpotifyLinkController';
import { YouTubeMusicLinkController } from '~services/youtube-music/YouTubeMusicLinkController';

interface GetRedirectLinkRequest {
  destinationMusicService: MusicService;
  name: string;
  artistName: string;
  albumName: string;
  duration: number;
}

type SearchResultWithoutLink = Omit<SearchResult, 'link'>;

const LINK_CONTROLLERS_MAP: Record<
  MusicService,
  MusicServiceLinkController | null
> = {
  SPOTIFY: new SpotifyLinkController(),
  AMAZONMUSIC: new AmazonMusicController(),
  APPLEMUSIC: new AppleMusicLinkController(),
  DEEZER: null,
  YOUTUBEMUSIC: new YouTubeMusicLinkController()
};

const MAX_MILLISECONDS_DURATION_DIFFERNCE = 5000;
const MINIMUM_SCORE = 80;

const SCORE_MAP = new Map<keyof SearchResult, number>([
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

  const sourceTrack = req.body;

  const linkController = LINK_CONTROLLERS_MAP[req.body.destinationMusicService];

  if (linkController) {
    const searchResults = await linkController.search(req.body);

    const bestResult = getBestTrackMatch(
      {
        name: sourceTrack.name,
        artistName: sourceTrack.artistName,
        albumName: sourceTrack.albumName,
        duration: sourceTrack.duration
      },
      searchResults
    );

    res.send(bestResult.link);
  } else {
    res.send(undefined);
  }
};

export default handler;

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
  destinationTracks: SearchResult[]
): SearchResult => {
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
  destinationTrack: SearchResult
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
