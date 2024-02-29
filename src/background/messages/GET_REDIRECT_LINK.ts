import type { MusicService } from '@synq/music-service-clients';

import type { PlasmoMessaging } from '@plasmohq/messaging';

import type { MusicServiceLinkController } from '~services/MusicServiceLinkController';
import { SpotifyLinkController } from '~services/spotify/SpotifyLinkController';
import { YouTubeMusicLinkController } from '~services/youtube-music/YouTubeMusicLinkController';

interface GetRedirectLinkRequest {
  destinationMusicService: MusicService;
  name: string;
  artistName: string;
  albumName: string;
  duration: number;
}

const LINK_CONTROLLERS_MAP: Record<
  MusicService,
  MusicServiceLinkController | null
> = {
  SPOTIFY: new SpotifyLinkController(),
  AMAZONMUSIC: null,
  APPLEMUSIC: null,
  DEEZER: null,
  YOUTUBEMUSIC: new YouTubeMusicLinkController()
};

const handler: PlasmoMessaging.MessageHandler<GetRedirectLinkRequest> = async (
  req,
  res
) => {
  if (!req.body) {
    res.send(null);
    return;
  }

  const linkController = LINK_CONTROLLERS_MAP[req.body.destinationMusicService];

  if (linkController) {
    const redirectLink = await linkController.getLink(req.body);
    res.send(redirectLink);
  } else {
    res.send(null);
  }
};

export default handler;
