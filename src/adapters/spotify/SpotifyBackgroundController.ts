import type {
  AlbumSearchResult,
  ArtistSearchResult,
  BackgroundController,
  TrackSearchResult
} from '~core/adapter';
import type { ParsedLink } from '~core/links';

import { SpotifyAdapter } from './SpotifyAdapter';

export class SpotifyBackgroundController implements BackgroundController {
  // Spotify's search API requires a TOTP-protected token we can no longer
  // obtain, so search is unavailable and redirecting *to* Spotify is disabled
  // (see SpotifyAdapter.disabledFeatures). These remain as no-ops to satisfy the
  // BackgroundController interface.
  async searchTracks(): Promise<TrackSearchResult[]> {
    return [];
  }

  async searchAlbums(): Promise<AlbumSearchResult[]> {
    return [];
  }

  async searchArtists(): Promise<ArtistSearchResult[]> {
    return [];
  }

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
