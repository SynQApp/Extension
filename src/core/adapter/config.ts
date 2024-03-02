import type { BackgroundController, ContentController } from './controller';
import type { Feature } from './feature';
import type { ContentObserver } from './observer';

export interface MusicServiceAdapter {
  displayName: string;
  id: string;
  baseUrl: string;
  icon: string;
  urlMatches: string[];
  disabledFeatures: Feature[];
  backgroundController: () => BackgroundController;
  contentController: () => ContentController;
  observer: (contentController: ContentController) => ContentObserver;
}
