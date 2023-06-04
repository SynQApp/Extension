import type { SynQWindow } from '~types/Window';
import { YouTubeMusicPlayerState } from '~types/YouTubeMusicPlayerState';

import type { IController } from './IController';

declare let window: SynQWindow;

const exampleIds = ['DZhNgVyIrHw', 'lYBUbBu4W08'];

export class YouTubeMusicController implements IController {
  private _mode = 'navigation';
  private _navigationRequestInstance: any;

  constructor() {
    this._initialize();
  }

  private _initialize() {
    if (this._mode === 'navigation') {
      console.log('Initializing YouTube Music for navigation');
      this._ytmApp.navigator_.originalNavigate =
        this._ytmApp.navigator_.navigate;

      this._ytmApp.navigator_.navigate = (navigationEvent) => {
        if (
          navigationEvent?.data?.watchEndpointMusicSupportedConfigs
            ?.watchEndpointMusicConfig?.musicVideoType ===
          'MUSIC_VIDEO_TYPE_ATV'
        ) {
          this._navigationRequestInstance = navigationEvent;

          this._ytmApp.navigator_.navigate =
            this._ytmApp.navigator_.originalNavigate;
        }

        return this._ytmApp.navigator_.originalNavigate(navigationEvent);
      };
    }
  }

  private get _player() {
    return document.getElementById('movie_player') as any;
  }

  private get _ytmApp() {
    return document.getElementsByTagName('ytmusic-app')?.[0] as any;
  }

  play(): void {
    throw new Error('Method not implemented.');
  }

  playPause(): void {
    if (this._player.getPlayerState() === YouTubeMusicPlayerState.PLAYING) {
      this._player.pauseVideo();
    } else {
      this._player.playVideo();
    }
  }

  pause(): void {
    throw new Error('Method not implemented.');
  }

  next(): void {
    throw new Error('Method not implemented.');
  }

  previous(): void {
    throw new Error('Method not implemented.');
  }

  toggleShuffle(): void {
    throw new Error('Method not implemented.');
  }

  toggleLike(): void {
    throw new Error('Method not implemented.');
  }

  toggleDislike(): void {
    throw new Error('Method not implemented.');
  }

  setVolume(volume: number): void {
    throw new Error('Method not implemented.');
  }

  seekTo(time: number): void {
    throw new Error('Method not implemented.');
  }

  public async startTrack(trackId: string): Promise<void> {
    if (this._mode === 'queue') {
      await this.startTrackWithQueue(trackId);
    } else {
      await this.startTrackWithNavigation(trackId);
    }
  }

  // TODO: You've gotten the queue option fully working. Now get the navigation option fully working as well so you can compare.
  public async startTrackWithQueue(trackId: string): Promise<void> {
    let addQueueRequest = await this._createAddQueueRequest(trackId);

    console.log(addQueueRequest);

    console.log(this._ytmApp);
    console.log(this._ytmApp.queue_);

    this._ytmApp.queue_.addItems([addQueueRequest], true);

    let player = document.getElementById('movie_player') as any;

    player.nextVideo();
  }

  private _clearQueue(): void {
    let ytmApp = document.querySelector('ytmusic-app') as any;
    const queue = ytmApp.queue_.store.getState().queue;

    queue.items.forEach((item, index) => {
      if (index === 0) {
        return;
      }

      let renderer =
        item.playlistPanelVideoRenderer ??
        item.playlistPanelVideoWrapperRenderer.primaryRenderer
          .playlistPanelVideoRenderer;

      let itemId = renderer.navigationEndpoint.watchEndpoint.index;

      ytmApp.queue_.removeItem(itemId.toString());
    });

    let player = document.getElementById('movie_player') as any;
    player.clearQueue();
  }

  startTrackWithNavigation(trackId: string): void {
    // /**
    //  * Write a stackoverflow post
    //  *
    //  * Class definition is within a script that is loaded from remote source. There are event handlers
    //  * that expect an instance of that class and they check it with instanceof. Can I either access the class
    //  * somehow or mimic it such that it tricks instanceof?
    //  */

    // // LOL WTF IS THIS

    // // Get the YouTube Music app
    // let ytmApp = document.querySelector('ytmusic-app') as any;

    // // Move the navigate function to a new property so it still has access to this
    // ytmApp.navigator_.origNavigate = ytmApp.navigator_.navigate;

    // // Override the navigate function to capture navigation events
    // ytmApp.navigator_.navigate = (a) => {
    //   if (!window.navigateEvents) {
    //     window.navigateEvents = [];
    //   }

    //   window.navigateEvents.push(a);

    //   ytmApp.navigator_.origNavigate(a);
    // };

    // // TODO: Trigger a navigation event

    // // Get the captured event
    // let capturedEvent = window.navigateEvents[0];

    if (!this._navigationRequestInstance) {
      throw new Error('No navigation request instance');
    }

    // Clone the event
    let newNavEvent = Object.assign(
      Object.create(Object.getPrototypeOf(this._navigationRequestInstance)),
      this._navigationRequestInstance
    );

    // Update the event
    newNavEvent.data = {
      videoId: trackId,
      watchEndpointMusicSupportedConfigs: {
        watchEndpointMusicConfig: {
          musicVideoType: 'MUSIC_VIDEO_TYPE_ATV'
        }
      }
    };

    // Trigger the event
    this._ytmApp.navigator_.navigate(newNavEvent);
  }

  private _getContextClientVersion(): string {
    const currentDate = new Date();
    const year = currentDate.getUTCFullYear();
    const month = (currentDate.getUTCMonth() + 1).toString().padStart(2, '0');
    const day = currentDate.getUTCDate().toString().padStart(2, '0');

    return `1.${year}${month}${day}.01.00`;
  }

  private async _createAddQueueRequest(trackId: string): Promise<any> {
    // Make request to YouTube Music API with the trackId to get all of the information about the track
    // Then use that information to create the request object

    // Clear the the queue using the removeItem method for each item in the queue
    // Make request to /next based on Unofficial YouTube Music API docs
    // Parse the response
    // Add the track to the queue

    // Based on: https://github.com/sigma67/ytmusicapi/blob/master/ytmusicapi/mixins/watch.py
    let nextBody = {
      enablePersistentPlaylistPanel: true,
      isAudioOnly: false,
      tunerSettingValue: 'AUTOMIX_SETTING_NORMAL',
      videoId: trackId,
      playlistId: `RDAMVM${trackId}`,
      watchEndpointMusicSupportedConfigs: {
        watchEndpointMusicConfig: {
          hasPersistentPlaylistPanel: true,
          musicVideoType: 'MUSIC_VIDEO_TYPE_ATV'
        }
      },
      context: {
        client: {
          clientName: 'WEB_REMIX',
          clientVersion: this._getContextClientVersion()
        },
        user: {},
        hl: window.yt.config_.HL
      }
    };

    const res = await fetch(
      'https://music.youtube.com/youtubei/v1/next?alt=json',
      {
        method: 'POST',
        headers: {
          'user-agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:88.0) Gecko/20100101 Firefox/88.0',
          accept: '*/*',
          'accept-encoding': 'gzip, deflate',
          'content-type': 'application/json',
          'content-encoding': 'gzip',
          origin: 'https://music.youtube.com'
        },
        body: JSON.stringify(nextBody)
      }
    ).then((res) => res.json());

    console.log('res', res);

    const playlistPanelVideoRenderer =
      res?.contents?.singleColumnMusicWatchNextResultsRenderer?.tabbedRenderer
        ?.watchNextTabbedResultsRenderer?.tabs?.[0]?.tabRenderer?.content
        ?.musicQueueRenderer?.content?.playlistPanelRenderer?.contents?.[0]
        ?.playlistPanelVideoRenderer;

    let addToQueueRequest = {
      playlistPanelVideoRenderer
    };

    return addToQueueRequest;
  }
}
