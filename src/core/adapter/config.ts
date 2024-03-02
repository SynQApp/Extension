import type { BackgroundController, ContentController } from './controller';
import type { Feature } from './feature';
import type { ContentObserver } from './observer';

/**
 * A music service adapter is a the main entity each supported music service
 * has. It contains all the necessary information to initialize the music service
 * in for SynQ.
 */
export interface MusicServiceAdapter {
  /**
   * The readable name of the music service.
   */
  displayName: string;
  /**
   * The unique identifier of the music service.
   */
  id: string;
  /**
   * The base URL of the music service. This is used when the user selects a
   * music service from the popup to open the music service in a new tab.
   */
  baseUrl: string;
  /**
   * The icon of the music service.
   */
  icon: string;
  /**
   * The glob patterns to match the music service URL for content scripts.
   */
  urlMatches: string[];
  /**
   * The list of features that are not supported for the music service.
   */
  disabledFeatures: Feature[];
  /**
   * A factory function to create the background controller for the music service.
   */
  backgroundController: () => BackgroundController;
  /**
   * A factory function to create the content controller for the music service.
   */
  contentController: () => ContentController;
  /**
   * A factory function to create the content observer for the music service.
   * @param contentController The content controller for the music service.
   */
  contentObserver: (contentController: ContentController) => ContentObserver;
}
