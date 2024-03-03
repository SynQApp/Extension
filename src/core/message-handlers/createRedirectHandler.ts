import type { ContentController } from '~core/adapter/controller';
import type { LinkType } from '~core/link';
import { sendToBackground } from '~core/messaging';
import type { ReconnectingHub } from '~core/messaging/hub';
import { MusicControllerMessage, type Settings } from '~types';

/**
 * Register a controller handler that handles events from other components
 * in the extension.
 */
export const createRedirectHandler = (
  controller: ContentController,
  hub: ReconnectingHub
) => {
  hub.addListener(async (message) => {
    switch (message?.name) {
      case MusicControllerMessage.REDIRECT: {
        await handleRedirect(controller, message.body?.linkType);
        break;
      }
    }
  });
};

const handleRedirect = async (
  controller: ContentController,
  linkType: LinkType
): Promise<void> => {
  const settings = await sendToBackground<undefined, Settings>({
    name: 'GET_SETTINGS'
  });

  const params = new URLSearchParams({
    destinationMusicService: settings.preferredMusicService,
    linkType
  });

  switch (linkType) {
    case 'TRACK': {
      const trackDetails = await controller.getTrackLinkDetails();

      if (!trackDetails) {
        return;
      }

      params.set('name', trackDetails.name);
      params.set('artistName', trackDetails.artistName);
      params.set('duration', trackDetails.duration?.toString() ?? '');
      params.set('albumName', trackDetails.albumName ?? '');
      params.set('albumCoverUrl', trackDetails.albumCoverUrl ?? '');

      break;
    }
    case 'ALBUM': {
      const albumDetails = await controller.getAlbumLinkDetails();

      if (!albumDetails) {
        return;
      }

      params.set('name', albumDetails.name ?? '');
      params.set('artistName', albumDetails.artistName ?? '');
      params.set('albumCoverUrl', albumDetails.albumCoverUrl ?? '');

      break;
    }
    case 'ARTIST': {
      const artistDetails = await controller.getArtistLinkDetails();

      if (!artistDetails) {
        return;
      }

      params.set('name', artistDetails.name ?? '');
      params.set('artistImageUrl', artistDetails.artistImageUrl ?? '');

      break;
    }
  }

  const url = `${
    process.env.PLASMO_PUBLIC_SYNQ_WEBSITE
  }/redirect?${params.toString()}`;
  window.location.href = url;
};
