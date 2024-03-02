import type { ContentController } from '~core/adapter/controller';
import { MusicLinkControllerMessage, type Settings } from '~types';
import type { ReduxHub } from '~util/connectToReduxHub';

/**
 * Register a controller handler that handles events from other components
 * in the extension.
 */
export const createRedirectHandler = (
  controller: ContentController,
  hub: ReduxHub
) => {
  hub.addListener(async (message) => {
    switch (message?.name) {
      case MusicLinkControllerMessage.REDIRECT: {
        await handleRedirect(controller, hub);
        break;
      }
    }
  });
};

const handleRedirect = async (
  controller: ContentController,
  hub: ReduxHub
): Promise<void> => {
  const settings = await hub.asyncPostMessage<Settings>({
    name: 'GET_SETTINGS'
  });

  const trackDetails = await controller.getLinkTrack();

  if (!trackDetails) {
    return;
  }

  const params = new URLSearchParams({
    destinationMusicService: settings.preferredMusicService,
    name: trackDetails.name,
    artistName: trackDetails.artistName,
    duration: trackDetails.duration.toString()
  });

  if (trackDetails.albumName) {
    params.set('albumName', trackDetails.albumName);
  }

  if (trackDetails.albumCoverUrl) {
    params.set('albumCoverUrl', trackDetails.albumCoverUrl);
  }

  const url = `${
    process.env.PLASMO_PUBLIC_SYNQ_WEBSITE
  }/redirect?${params.toString()}`;
  window.location.href = url;
};
