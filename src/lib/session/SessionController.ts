import type { Listener, Session, SessionQueueItem } from '~types';

class NotImplementedError extends Error {
  constructor() {
    super('Not Implemented');
  }
}

export class SessionController {
  public endSession() {
    throw new NotImplementedError();
  }

  public lockSession() {
    throw new NotImplementedError();
  }

  public unlockSession() {
    throw new NotImplementedError();
  }

  public kickListener(listenerId: string) {
    throw new NotImplementedError();
  }

  public getListeners(): Listener[] {
    throw new NotImplementedError();
  }

  public getSessionDetails(): Session {
    throw new NotImplementedError();
  }

  public playPauseSession() {
    throw new NotImplementedError();
  }

  public playSession() {
    throw new NotImplementedError();
  }

  public pauseSession() {
    throw new NotImplementedError();
  }

  public nextSession() {
    throw new NotImplementedError();
  }

  public previousSession() {
    throw new NotImplementedError();
  }

  public toggleSessionRepeatMode() {
    throw new NotImplementedError();
  }

  public seekToSession(time: number) {
    throw new NotImplementedError();
  }

  public updateSessionQueueItemPosition(
    sourceIndex: number,
    destinationIndex: number
  ) {
    throw new NotImplementedError();
  }

  public removeSessionQueueItem(index: number) {
    throw new NotImplementedError();
  }

  public addSessionQueueItem(sessionQueueItem: Omit<SessionQueueItem, 'id'>) {
    throw new NotImplementedError();
  }

  public getSessionQueue(): SessionQueueItem[] {
    throw new NotImplementedError();
  }
}
