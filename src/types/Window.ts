import type { MusicController } from '~lib/music-controllers/MusicController';
import type { ObserverEmitter } from '~lib/observer-emitters/IObserverEmitter';

export interface SynQWindow extends Window {
  SynQ: {
    observerEmitter: ObserverEmitter;
    musicController: MusicController;
  };
}
