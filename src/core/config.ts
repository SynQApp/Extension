export type Feature =
  | 'dislike'
  | 'inboundTranslate'
  | 'like'
  | 'outboundTranslate'
  | 'displayQueue'
  | 'playQueueItem'
  | 'repeatMode';

export interface MusicServiceConfig {
  displayName: string;
  id: string;
  baseUrl: string;
  icon: string;
  urlMatches: string[];
  disabledFeatures: Feature[];
}
