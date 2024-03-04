# Guide to Building Adapters

## Getting Started

### Intro to Adapters

Adapters are the glue code between SynQ's core functionality and the music services it supports. SynQ's core consists of UI, orchestration, util, and other logic.Each adapter is responsible for interfacing with a specific music service, such as Spotify, Apple Music, or YouTube Music. Adapters are primarily responsible for:

- Programmatically controlling the music service's player either via simulated user input or through the service's API.
- Fetching metadata about the currently playing song either through scraping the web player or through the service's API.
- Emitting events to the SynQ core when the song changes, the player state changes, or other relevant events occur.

### Creating a new Adapter

To add a new adapter, you will need to create a new directory under the `src/adapters` directory, and it should be named after the music service you are adding support for. For example, if you are adding support for SoundCloud, you would create a new directory called `soundcloud`. Inside this directory, add the following files:

- `<ServiceName>ContentController.ts` - The content controller for the music service. Read more on the [Content Controllers](#content-controllers) below.
- `<ServiceName>ContentObserver.ts` - The content observer for the music service. Read more on the [Content Observers](#content-observers) below.
- `<ServiceName>BackgroundController.ts` - The background controller for the music service. Read more on the [Background Controller Interface](#background-controllers) below.
- `<ServiceName>Adapter.ts` - The main entry point for the adapter. Read more on the [Adapter Interface](#adapter-interface) below.

Then, you will need to implement the `MusicServiceAdapter` interface in the `<ServiceName>Adapter.ts` file, the `BackgroundController` interface in the `<ServiceName>BackgroundController.ts` file, the `ContentController` interface in the `<ServiceName>ContentController.ts` file, and the `ContentObserver` interface in the `<ServiceName>ContentObserver.ts` file. These files will contain the logic for controlling the music service, observing the music service's player, and emitting events to the SynQ core.

You will also need to add a new entry to the `types/MusicService.ts` file to add the music service to the enum. You will use this enum as the `id` property in the `MusicServiceAdapter` interface.

### Enabling the Adapter

1. After you have implemented the adapter, you will need to add it to the `src/adapters/index.ts` file. This file exports an array of all the adapters that SynQ supports. You will need to add your adapter to this array.
1. Finally, you will need to add any URL matches for the music service to each of the shared content scripts as the Plasmo extension does not enable us to import these values from a shared configuration for MAIN world content scripts. Make sure to add the URL matches to the following files:
   1. `src/contents/adapter.ts`
   1. `src/contents/common.ts`
   1. `src/contents/picture-in-picture.ts`
   1. `src/contents/redirect-popup.ts`

### Building and Testing the Adapter

As of right now, there are no automated tests for SynQ (although we would love to have them!). Therefore, you will need to manually test your adapter to ensure that it works as expected. You can use the `pnpm build` command to run a production build of the extension, and then load the extension into your browser to test it (see more in the [Contributing Guide](https://github.com/SynQApp/Extension/blob/main/docs/CONTRIBUTING.md)).

Here is an example manual test run you can perform:

1. Install the extension in your browser. The onboarding screen should open in a new tab.
1. Complete the onboarding steps, selecting your adapter's service as the preferred music service.
1. On the final onboarding screen, select the "Example Spotify Link" to open a Spotify track. You should see the SynQ popup ask if you would like to listen on your preferred music service.
1. Click "Yes" and the music service should open in a new tab with the same track.
1. Open the SynQ popup and test each of the playback controls (play/pause, scrubbing, skip, previous, next, volume, thumbs up/down if supported, queue controls) to ensure they work as expected.
1. Test key controls in the mini player. Use up and down for volume control, left and right for skip/prev, and space for play/pause.
1. Test key controls in the full player. Use up and down for volume control, left and right for skip/prev, and space for play/pause.
1. Test the picture-in-picture mode to ensure it works as expected.
1. Navigate to a different tab and scrub the track to a few seconds from the end and then close the mini player. Once the next tracks starts, you should get a notification.

## Implementing an Adapter

### Content Controllers

`ContentController`s are named this way because they are run in "content scripts." [Content scripts](https://developer.chrome.com/docs/extensions/develop/concepts/content-scripts) are JavaScript files that run in the context of web pages. They can read and modify the DOM of web pages your browser visits. Specifically, `ContentController`s run in "MAIN world" content scripts, which are content scripts that have access to the full DOM of the web page and can interact with the web page's JavaScript. These scripts have very limited access to Chrome APIs, but SynQ primarily facilitates any communication and API needs you may have.

#### Controls

For your adapter, you will need to implement a `ContentController` that is responsible for implementing programmatic controls for the music service's player. This includes playing, pausing, skipping, seeking, and other controls. Typically, you will do this by simulating user input (such as clicking UI buttons) or finding programmatic controls you can access from a content script.

As an example, here is the implementation of a user input simulation for a play/pause button on Amazon Music:

```ts
import { ContentController } from '../types/ContentController';

export class AmazonContentController implements ContentController {
  public play(): void {
    const playButtonContainer = document.querySelector(
      'music-button[icon-name="play"]'
    );
    const playButton = playButtonContainer?.shadowRoot?.querySelector('button');

    playButton?.click();
  }

  // ...other methods
}
```

And here is an example of a programmatic control for a play/pause button on Apple Music, using the MusicKit API already included on the page:

```ts
import { ContentController } from '../types/ContentController';

export class AppleMusicContentController implements ContentController {
  public play(): void {
    const musicKit = window.MusicKit.getInstance();
    musicKit.play();
  }

  // ...other methods
}
```

#### Link Translation

One of SynQ's awesome features is the ability to open a track, album, or artist from one music service in another music service. This is done by translating the URL of the track from one music service to the URL of the track in the other music service. The `ContentController` interface scraping methods for pulling metadata from the music service's web player for the purpose of link translation, including `getTrackLinkDetails`, `getAlbumLinkDetails`, and `getArtistLinkDetails`. These methods are run when the user visits a track, album, or artist page on your adapter's music service.

Here again, you can use whatever methods you need to pull the metadata from the web page. Here is an example of we implemented `getArtistLinkDetails` for YouTube Music:

```ts
import type { ArtistLinkDetails, ContentController } from '~core/adapter';

export class YouTubeMusicContentController implements ContentController {
  // ...other methods

  public getArtistLinkDetails(): ArtistLinkDetails | null {
    const nameElement = document.querySelector('#header .title') as HTMLElement;
    const name = nameElement?.innerText ?? '';

    const imageElement = document.querySelector(
      '#header source'
    ) as HTMLElement;
    const artistImageUrl = imageElement?.getAttribute('srcset') ?? '';

    return {
      artistImageUrl,
      name
    };
  }
}
```

### Content Observers

Similar to `ContentController`s, `ContentObserver`s are run within "MAIN world" content scripts. However, rather than being strongly controlled by SynQ, `ContentObserver`s have only one method, `observe`, which is called by SynQ when the user visits a page on your adapter's music service. This method should set up any event listeners, MutationObservers, or other observers that are necessary to detect when the music playback or track changes. Then, the `ContentObserver` should use the `updatePlaybackState` and `updateCurrentTrack` methods from `~core/player` to instruct SynQ to update the player state and current track.

Here is an example of how we implemented part of the `observe` method for YouTube Music that watches the progress bar for changes in playback time:

```ts
import type { ContentObserver } from '~core/adapter';
import { updateCurrentTrack, updatePlaybackState } from '~core/player';

export class YouTubeMusicContentObserver implements ContentObserver {
  // SynQ will initialize the observer with the content controller
  constructor(private _controller: YouTubeMusicContentController) {}

  public observe(): void {
    const playerStateObserver = new MutationObserver(async () => {
      const playerState = this._controller.getPlayerState();
      await updatePlaybackState(playerState);
    });

    const progressBarKnobElement = document.querySelector(
      '#progress-bar #sliderKnob .slider-knob-inner'
    );
    if (progressBarKnobElement) {
      playerStateObserver.observe(progressBarKnobElement, {
        attributeFilter: ['value']
      });
    }
  }
}
```

### Background Controllers

`BackgroundController`s are run in the [background service worker](https://developer.chrome.com/docs/extensions/get-started/tutorial/service-worker-events) of SynQ, which is a JavaScript file that runs in the background of your browser. It is not tied to any particular tab, and it runs in a separate process from the content scripts. It also has access to the full range of Chrome APIs and the ability to make HTTP requests without the same restrictions traditional web pages have, such as CORS and Content Security Policies.

In SynQ, your Adapater's `BackgroundController` is responsible for interfacing with the music service's API for link translation purposes, specifically when a user wants to go from a different music service to your adapter's music service. This is because the user will not already have your adapter's music service open in a tab, so we need to use the background service worker search for the track, album, or artist.

Here is an example of how we implemented the `searchArtists` method for Apple Music:

```ts
import type {
  ArtistSearchResult,
  BackgroundController,
  SearchArtistsInput
} from '~core/adapter';

export class AppleMusicBackgroundController implements BackgroundController {
  public async searchArtists(
    searchInput: SearchArtistsInput
  ): Promise<ArtistSearchResult[]> {
    const mk = window.MusicKit.getInstance();
    const artists = await mk.api.search(searchInput.name, {
      types: ['artists']
    }).artists.data;

    return artists.map((artist: any) => ({
      id: artist.id,
      name: artist.attributes.name,
      link: artist.href,
      artistImageUrl: artist.attributes.artwork.url
    }));
  }

  // ...other methods
}
```

We also implement some basic link methods for converting from structured data to a URL and back (`getLink` and `parseLink`). We use this to check whether a page from the source music service is translatable and convert the link from a string to structured data. Then we can use the structured data to search for the track, album, or artist on the destination music service. Finally, we convert the structured data back to a URL in the destination service to open the track, album, or artist on the destination music service.

Here is an example of how we implemented the `getLink` and `parseLink` methods for Spotify:

```ts
import type { BackgroundController } from '~core/adapter';
import type { ParsedLink } from '~core/links';

export class SpotifyBackgroundController implements BackgroundController {
  public getLink(link: ParsedLink): string {
    const { type } = link;
    const baseUrl = SpotifyAdapter.baseUrl;

    if (type === 'ALBUM') {
      return `${baseUrl}/album/${link.albumId}?si=1`;
    } else if (type === 'ARTIST') {
      return `${baseUrl}/artist/${link.artistId}?si=1`;
    } else if (type === 'TRACK') {
      return `${baseUrl}/track/${link.trackId}?si=1`;
    } else {
      throw new Error('Invalid link type');
    }
  }

  public parseLink(link: string): ParsedLink | null {
    const parsedLink: Partial<ParsedLink> = {
      musicService: 'SPOTIFY'
    };

    const url = new URL(link);
    const path = url.pathname;
    const pathParts = path.split('/').filter((part) => part !== '');
    const query = url.searchParams;

    if (pathParts[0] === 'album') {
      if (
        query.has('highlight') &&
        query.get('highlight')?.startsWith('spotify:track:')
      ) {
        const trackId = query.get('highlight')?.split(':')[2];
        parsedLink.trackId = trackId || '';
        parsedLink.type = 'TRACK';
      }

      parsedLink.albumId = pathParts[1];
      parsedLink.type = 'ALBUM';
    } else if (pathParts[0] === 'track') {
      parsedLink.trackId = pathParts[1];
      parsedLink.type = 'TRACK';
    } else if (pathParts[0] === 'artist') {
      parsedLink.artistId = pathParts[1];
      parsedLink.type = 'ARTIST';
    }

    return parsedLink.albumId || parsedLink.artistId || parsedLink.trackId
      ? (parsedLink as ParsedLink)
      : null;
  }
}
```

### Adapter Interface

Once you've implemented the `ContentController`, `ContentObserver`, and `BackgroundController`, you can wrap them all up in the `MusicServiceAdapter` interface. This interface is the main entry point for the adapter and is responsible for initializing the adapter and its classes as well as identifying some properties SynQ will use throughout the extension.

#### Config

- `displayName` - The display name of the music service. This is used throughout various parts of SynQ's UI.
- `id` - The unique identifier for the music service. This is used to identify the music service, and should be an enum value from `types/MusicService.ts`.
- `baseUrl` - The base URL of the music service. This is used when the user selects "Continue with [Music Service]" when first opening the mini player.
- `icon` - The icon of the music service. This is used in various parts of SynQ's UI. This should be an SVG and placed in `/assets/images`.
- `urlMatches` - An array of URL matches for the music service. This is used to determine when the user is on a page for the music service. This should be an array of strings that are valid URL match patterns for the music service.
- `disabledFeatures` - An array of features that are not supported by the music service or your adapter. This is used to disable certain features in SynQ's UI. This should be an array of strings that are valid feature names from `core/adapter/feature.ts`.
- `enabledKeyControls` - Some music services already enable some or all key controls for their web player. Use this property to specify which key controls should be enabled by SynQ.

#### Factories

- `backgroundController` - A factory function that returns an instance of the `BackgroundController` for the music service.
- `contentController` - A factory function that returns an instance of the `ContentController` for the music service.
- `contentObserver` - A factory function that returns an instance of the `ContentObserver` for the music service. SynQ will initialize the observer with the content controller initialized by the `contentController` factory function.
