import type {
  GetBasicTrackDetailsResponse,
  GetLinkInput,
  MusicServiceLinkController
} from '~services/MusicServiceLinkController';
import type { ValueOrPromise } from '~types';

export class AmazonMusicLinkController implements MusicServiceLinkController {
  getBasicTrackDetails(): ValueOrPromise<GetBasicTrackDetailsResponse> {
    throw new Error('Method not implemented.');
  }

  getLink(basicTrackDetails: GetLinkInput): ValueOrPromise<string | null> {
    throw new Error('Method not implemented.');
  }
}
