import { getSettings, store, waitForRehydration } from '~store';
import { clearMusicServiceTabs } from '~store/slices/musicServiceTabs';
import { setSettings } from '~store/slices/settings';
import type { Settings } from '~types';

const MIN_SYNQ_VERSION = '4.0.0';
const OPTIONS_KEY = 'options';
const LAST_FM_SESSION_KEY = 'lastfm-info';

const getPreviousOptions = async () => {
  return (await chrome.storage.sync.get(OPTIONS_KEY))[OPTIONS_KEY];
};

const getPreviousLastFmSession = async () => {
  return (await chrome.storage.sync.get(LAST_FM_SESSION_KEY))[
    LAST_FM_SESSION_KEY
  ];
};

const transferSettings = async () => {
  const previousOptions = await getPreviousOptions();

  // Read through the rehydration-aware helper. Spreading a not-yet-rehydrated
  // state here would persist the default settings back over the user's saved
  // ones, turning a transient race into permanent data loss.
  const settings = await getSettings();

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

const openOnboardingPage = async (update: boolean) => {
  const queryParams = new URLSearchParams();

  if (update) {
    queryParams.set('update', 'true');

    const lastFmSession = await getPreviousLastFmSession();

    if (lastFmSession?.key) {
      queryParams.set('lastfm', 'true');
    }
  }

  const url = `${chrome.runtime.getURL(
    `tabs/onboard.html`
  )}?${queryParams.toString()}`;
  chrome.tabs.create({ url });
};

export const initializeInstallHandler = () => {
  chrome.runtime.onInstalled.addListener(async (installDetails) => {
    // Dispatching before rehydration completes means the incoming REHYDRATE
    // action overwrites this reset with the previously stored tab list.
    await waitForRehydration();

    store.dispatch(clearMusicServiceTabs());

    if (installDetails.reason === 'install') {
      openOnboardingPage(false);
    } else if (installDetails.reason === 'update') {
      if (
        installDetails.previousVersion &&
        installDetails.previousVersion < MIN_SYNQ_VERSION
      ) {
        await transferSettings();
        await openOnboardingPage(true);
      }
    }
  });
};
