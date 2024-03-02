import type { ContentController } from '~core/adapter/controller';
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
        await handleRedirect(controller, hub);
        break;
      }
    }
  });
};

const handleRedirect = async (
  controller: ContentController,
  hub: ReconnectingHub
): Promise<void> => {
  const settings = await sendToBackground<undefined, Settings>({
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
