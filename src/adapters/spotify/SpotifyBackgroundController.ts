import { SpotifyEndpoints } from '~adapters/spotify/constants';
import type {
  NativeSpotifyAlbum,
  NativeSpotifyArtist,
  NativeSpotifySongTrack
} from '~adapters/spotify/types';
import type {
  AlbumSearchResult,
  ArtistSearchResult,
  BackgroundController,
  SearchAlbumsInput,
  SearchArtistsInput,
  SearchTracksInput,
  TrackSearchResult
} from '~core/adapter';
import type { ParsedLink } from '~core/links';

import { SpotifyAdapter } from './SpotifyAdapter';
import { getAuthorizationToken } from './auth';

const SPOTIFY_LISTEN_ENDPOINT = 'https://open.spotify.com';

export class SpotifyBackgroundController implements BackgroundController {
  async searchTracks(
    basicTrackDetails: SearchTracksInput
  ): Promise<TrackSearchResult[]> {
    const query = `${basicTrackDetails.name} ${basicTrackDetails.artistName}`;

    const tracks = await this._fetchTracks(query);

    const searchResults = tracks.map((track) => {
      return {
        link: `${SPOTIFY_LISTEN_ENDPOINT}/track/${track.id}`,
        name: track.name,
        artistName: track.artists[0].name,
        duration: basicTrackDetails.duration,
        albumName: basicTrackDetails.albumName
      };
    });

    return searchResults;
  }

  async searchAlbums(
    searchInput: SearchAlbumsInput
  ): Promise<AlbumSearchResult[]> {
    const query = `${searchInput.name} ${searchInput.artistName}`;

    const albums = await this._fetchAlbums(query);

    const searchResults = albums.map((album) => {
      return {
        link: `${SPOTIFY_LISTEN_ENDPOINT}/album/${album.id}`,
        name: album.name,
        artistName: album.artists[0].name
      };
    });
    return searchResults;
  }

  async searchArtists(
    searchInput: SearchArtistsInput
  ): Promise<ArtistSearchResult[]> {
    const artists = await this._fetchArtists(searchInput.name);

    const searchResults = artists.map((artist) => {
      return {
        link: `${SPOTIFY_LISTEN_ENDPOINT}/artist/${artist.id}`,
        name: artist.name
      };
    });

    return searchResults;
  }

  private async _fetchTracks(query: string): Promise<NativeSpotifySongTrack[]> {
    const token = await getAuthorizationToken();

    const searchParams = new URLSearchParams({
      q: query,
      type: 'track'
    });

    const response = await fetch(
      `${SpotifyEndpoints.SEARCH}?${searchParams.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    ).then((response) => response.json());

    const tracks = response.tracks.items;
    return tracks;
  }

  private async _fetchAlbums(query: string): Promise<NativeSpotifyAlbum[]> {
    const token = await getAuthorizationToken();

    const searchParams = new URLSearchParams({
      q: query,
      type: 'album'
    });

    const response = await fetch(
      `${SpotifyEndpoints.SEARCH}?${searchParams.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    ).then((response) => response.json());

    const albums = response.albums.items;
    return albums;
  }

  private async _fetchArtists(query: string): Promise<NativeSpotifyArtist[]> {
    const token = await getAuthorizationToken();

    const searchParams = new URLSearchParams({
      q: query,
      type: 'artist'
    });

    const response = await fetch(
      `${SpotifyEndpoints.SEARCH}?${searchParams.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    ).then((response) => response.json());

    const albums = response.artists.items;
    return albums;
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
