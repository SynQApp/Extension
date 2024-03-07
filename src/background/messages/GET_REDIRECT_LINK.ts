import type { PlasmoMessaging } from '@plasmohq/messaging';

import type { MusicService } from '~/types';
import adapters from '~adapters';
import type { BackgroundController, TrackSearchResult } from '~core/adapter';
import { getBestMatch } from '~core/links';
import type { LinkType } from '~core/links';

interface GetRedirectLinkRequest {
  destinationMusicService: MusicService;
  artistName: string;
  trackName?: string;
  albumName?: string;
  duration: number;
  linkType: LinkType;
}

const handler: PlasmoMessaging.MessageHandler<GetRedirectLinkRequest> = async (
  req,
  res
) => {
  if (!req.body) {
    res.send(undefined);
    return;
  }

  const linkRequest = req.body;

  const adapter = adapters.find(
    (adapter) => adapter.id === linkRequest.destinationMusicService
  );
  const backgroundController = adapter?.backgroundController();

  if (!backgroundController) {
    res.send(undefined);
    return;
  }

  if (linkRequest.linkType === 'TRACK') {
    const link = await getTrackRedirectLink(linkRequest, backgroundController);
    res.send(link);
  } else if (linkRequest.linkType === 'ALBUM') {
    const link = await getAlbumRedirectLink(linkRequest, backgroundController);
    res.send(link);
  } else if (linkRequest.linkType === 'ARTIST') {
    const link = await getArtistRedirectLink(linkRequest, backgroundController);
    res.send(link);
  }
};

export default handler;

const getTrackRedirectLink = async (
  linkRequest: GetRedirectLinkRequest,
  backgroundController: BackgroundController
) => {
  if (!linkRequest.trackName) {
    return undefined;
  }

  const searchResults = await backgroundController.searchTracks({
    artistName: linkRequest.artistName,
    name: linkRequest.trackName,
    albumName: linkRequest.albumName,
    duration: linkRequest.duration
  });

  const bestResult = getBestMatch(
    linkRequest,
    searchResults.map((result) => ({
      ...result,
      trackName: result.name,
      linkType: 'TRACK'
    }))
  );

  return bestResult.link;
};

const getAlbumRedirectLink = async (
  linkRequest: GetRedirectLinkRequest,
  backgroundController: BackgroundController
) => {
  if (!linkRequest.albumName) {
    return undefined;
  }

  const searchResults = await backgroundController.searchAlbums({
    name: linkRequest.albumName,
    artistName: linkRequest.artistName
  });

  const bestResult = getBestMatch(
    linkRequest,
    searchResults.map((result) => ({
      ...result,
      albumName: result.name,
      linkType: 'ALBUM'
    }))
  );

  return bestResult.link;
};

const getArtistRedirectLink = async (
  linkRequest: GetRedirectLinkRequest,
  backgroundController: BackgroundController
) => {
  const searchResults = await backgroundController.searchArtists({
    name: linkRequest.artistName
  });

  const bestResult = getBestMatch(
    linkRequest,
    searchResults.map((result) => ({
      artistName: result.name,
      link: result.link,
      linkType: 'ARTIST'
    }))
  );

  return bestResult.link;
};
