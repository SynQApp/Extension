export interface Maestro {
  getAudioPlayer(): {
    getAudioElement(): HTMLAudioElement;
  };
  getVolume(): number;
  isPlaying(): boolean;
  getCurrentTime(): number;
  getConfig(): {
    tier: string[];
  };
  addEventListener(event: string, callback: () => void): void;
  removeEventListener(event: string, callback: () => void): void;
}

export interface AmznMusic {
  appConfig: {
    accessToken: string;
    customerId: string;
    csrf: {
      token: string;
      ts: string;
      rnd: string;
    };
    deviceId: string;
    displayLanguage: string;
    sessionId: string;
    version: string;
  };
}

export interface NativeAmazonMusicQueueItem {
  id: string;
  primaryLink: {
    deeplink: string;
  };
  primaryText: string;
  secondaryText1: string;
  secondaryText2: string;
  secondaryText3: string;
  image: string;
}

export interface NativeAmazonAlbum {
  primaryLink: {
    deeplink: string;
  };
  primaryText: {
    text: string;
  };
  secondaryText: string;
}

export interface NativeAmazonTracksWidget {
  header: 'Tracks';
  items: NativeAmazonMusicQueueItem[];
}

export interface NativeAmazonAlbumsWidget {
  header: 'Albums';
  items: NativeAmazonAlbum[];
}

export interface NativeAmazonMusicSearchResult {
  methods: {
    template: {
      widgets: (NativeAmazonTracksWidget | NativeAmazonAlbumsWidget)[];
    };
  }[];
}
