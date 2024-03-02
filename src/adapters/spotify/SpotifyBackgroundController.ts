import type { NativeSpotifySongTrack } from '~adapters/spotify/types';
import { SpotifyEndpoints } from '~constants/spotify';
import type {
  BackgroundController,
  SearchInput,
  SearchResult
} from '~core/adapter';

import { getAuthorizationToken } from './auth';

const SPOTIFY_LISTEN_ENDPOINT = 'https://open.spotify.com/track';

export class SpotifyBackgroundController implements BackgroundController {
  async search(basicTrackDetails: SearchInput): Promise<SearchResult[]> {
    const query = `${basicTrackDetails.name} ${basicTrackDetails.artistName}`;

    const tracks = await this._search(query);

    const searchResults = tracks.map((track) => {
      return {
        link: `${SPOTIFY_LISTEN_ENDPOINT}/${track.id}`,
        name: track.name,
        artistName: track.artists[0].name,
        duration: basicTrackDetails.duration,
        albumName: basicTrackDetails.albumName
      };
    });

    return searchResults;
  }

  private async _search(query: string): Promise<NativeSpotifySongTrack[]> {
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
}
