import levenshtein from 'fast-levenshtein';

import type {
  GetBasicTrackDetailsResponse,
  GetLinkInput,
  MusicServiceLinkController
} from '~services/MusicServiceLinkController';
import type { NativeSpotifySongTrack } from '~types/Spotify';

const SPOTIFY_LISTEN_ENDPOINT = 'https://open.spotify.com/track';
const SPOTIFY_ACCESS_TOKEN_ENDPOINT =
  'https://open.spotify.com/get_access_token';
const SPOTIFY_SEARCH_ENDPOINT = 'https://api.spotify.com/v1/search';
const SPOTIFY_TRACK_ENDPOINT = 'https://api.spotify.com/v1/tracks';

export class SpotifyLinkController implements MusicServiceLinkController {
  async getBasicTrackDetails(): Promise<GetBasicTrackDetailsResponse> {
    const url = new URL(window.location.href);
    const pathParts = url.pathname.split('/');
    const trackId = pathParts[pathParts.length - 1];

    const track = await this._getTrack(trackId);

    if (!track) {
      return null;
    }

    return {
      name: track.name,
      artistName: track.artists[0].name,
      albumName: track.album.name,
      duration: track.duration_ms,
      albumCoverUrl: track.album.images[0].url
    };
  }

  async getLink(basicTrackDetails: GetLinkInput): Promise<string | null> {
    const query = `${basicTrackDetails.name} ${basicTrackDetails.artistName}`;

    const tracks = await this._search(query);
    const track = this._selectTrack(tracks, basicTrackDetails);

    if (!track) {
      return null;
    }

    return `${SPOTIFY_LISTEN_ENDPOINT}/${track.id}`;
  }

  private async _getTrack(id: string): Promise<NativeSpotifySongTrack | null> {
    const token = await this._getAuthorizationToken();

    const response = await fetch(`${SPOTIFY_TRACK_ENDPOINT}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then((response) => response.json());

    return response;
  }

  private async _search(query: string): Promise<NativeSpotifySongTrack[]> {
    const token = await this._getAuthorizationToken();

    const searchParams = new URLSearchParams({
      q: query,
      type: 'track'
    });

    const response = await fetch(
      `${SPOTIFY_SEARCH_ENDPOINT}?${searchParams.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    ).then((response) => response.json());

    const tracks = response.tracks.items;
    return tracks;
  }

  private async _getAuthorizationToken(): Promise<string> {
    const response = await fetch(
      `${SPOTIFY_ACCESS_TOKEN_ENDPOINT}?reason=transport&productType=web_player`,
      {
        credentials: 'include'
      }
    );
    const json = await response.json();
    return json.accessToken;
  }

  private _selectTrack(
    tracks: NativeSpotifySongTrack[],
    basicTrackDetails: GetLinkInput
  ): NativeSpotifySongTrack | null {
    const nonNullTrackOptions = tracks.filter((track) => track !== null);

    if (nonNullTrackOptions.length === 0) {
      return null;
    }

    const matchScores = nonNullTrackOptions.map((track) => {
      const titleScore = levenshtein.get(
        this._sanitizeTitle(basicTrackDetails.name),
        this._sanitizeTitle(track.name)
      );
      const artistScore = levenshtein.get(
        basicTrackDetails.artistName,
        track.artists[0].name
      );
      return titleScore + artistScore;
    });

    const minScore = Math.min(...matchScores);

    if (minScore > 5) {
      return null;
    }

    const bestMatchIndex = matchScores.findIndex((score) => score === minScore);

    return nonNullTrackOptions[bestMatchIndex];
  }

  private _sanitizeTitle(title: string): string {
    return title.replace(/ *\([^)]*\) */g, '').replace(/ *\[[^)]*\] */g, '');
  }
}
