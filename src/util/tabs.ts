export default {
  getMusicServiceTab: async () => {
    const tabs = (
      await Promise.all([
        chrome.tabs.query({
          url: '*://*.spotify.com/*'
        }),
        chrome.tabs.query({
          url: '*://music.apple.com/*'
        }),
        chrome.tabs.query({
          url: '*://music.youtube.com/*'
        }),
        chrome.tabs.query({
          url: '*://music.amazon.com/*'
        })
      ])
    ).flat();

    return tabs[0];
  }
};
