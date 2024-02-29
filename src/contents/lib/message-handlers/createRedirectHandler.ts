import type { MusicServiceLinkController } from '~services/MusicServiceLinkController';
import { store } from '~store';
import { MusicLinkControllerMessage } from '~types';
import type { ReduxHub } from '~util/connectToReduxHub';

/**
 * Register a controller handler that handles events from other components
 * in the extension.
 */
export const createRedirectHandler = (
  controller: MusicServiceLinkController,
  hub: ReduxHub
) => {
  hub.addListener(async (message) => {
    switch (message?.name) {
      case MusicLinkControllerMessage.REDIRECT: {
        await handleRedirect(controller);
        break;
      }
    }
  });
};

const handleRedirect = async (
  controller: MusicServiceLinkController
): Promise<void> => {
  const settings = store.getState().settings;
  const trackDetails = await controller.getBasicTrackDetails();

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
  }/redirectv2?${params.toString()}`;
  window.location.href = url;
};
