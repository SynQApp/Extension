import { store } from '~store';
import { clearMusicServiceTabs } from '~store/slices/musicServiceTabs';
import { setSettings } from '~store/slices/settings';
import type { Settings } from '~types';

const MIN_SYNQ_VERSION = '4.0.0';
const OPTIONS_KEY = 'options';

const getPreviousOptions = async () => {
  return (await chrome.storage.sync.get(OPTIONS_KEY)).options;
};

const transferSettings = async () => {
  const settings = store.getState().settings;
  const previousOptions = await getPreviousOptions();

  const notificationsEnabled = previousOptions.notifications;
  const miniPlayerKeyControlsEnabled = previousOptions.miniKeyControl;
  const musicServiceKeyControlsEnabled = previousOptions.ytmKeyControl;
  const redirectsEnabled = previousOptions.spotifyToYTM;

  const newSettings: Settings = {
    ...settings,
    notificationsEnabled,
    miniPlayerKeyControlsEnabled,
    musicServiceKeyControlsEnabled,
    redirectsEnabled,
    preferredMusicService: 'YOUTUBEMUSIC'
  };

  store.dispatch(setSettings(newSettings));
};

const openOnboardingPage = (update: boolean) => {
  const url =
    chrome.runtime.getURL(`tabs/onboard.html`) + (update ? '?update=true' : '');
  chrome.tabs.create({ url });
};

export const createInstallHandler = () => {
  chrome.runtime.onInstalled.addListener(async (installDetails) => {
    store.dispatch(clearMusicServiceTabs());

    if (installDetails.reason === 'install') {
      openOnboardingPage(false);
    } else if (installDetails.reason === 'update') {
      if (
        installDetails.previousVersion &&
        installDetails.previousVersion < MIN_SYNQ_VERSION
      ) {
        await transferSettings();
        openOnboardingPage(true);
      }
    }
  });
};
