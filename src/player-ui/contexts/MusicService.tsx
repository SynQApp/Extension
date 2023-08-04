import React, { createContext, useContext, useEffect, useState } from 'react';

import { ALL_URL_MATCHES } from '~constants/urls';
import { ContentEvent } from '~types/ContentEvent';
import type { MusicService } from '~types/MusicService';
import { getMusicServiceFromUrl } from '~util/musicService';

interface MusicServiceTab {
  addListener: (callback: (message: any) => void) => void;
  removeListener: (callback: (message: any) => void) => void;
  sendMessage: (message: any) => void;
  musicService: MusicService;
}

interface MusicServiceContextValue {
  tabs: MusicServiceTab[] | null;
  selectedTab: MusicServiceTab | null;
  setSelectedTab: React.Dispatch<React.SetStateAction<MusicServiceTab | null>>;
}

const MusicServiceContext = createContext<MusicServiceContextValue | null>(
  null
);

interface SelectedMusicServiceProviderProps {
  children: React.ReactNode;
}

/**
 * Returns the selected tab ID and a function to set the selected tab ID.
 * Automatically selects the tab if there is only one. Otherwise, the tab
 * must be selected manually.
 */
export const MusicServiceProvider = ({
  children
}: SelectedMusicServiceProviderProps) => {
  const [tabs, setTabs] = useState<MusicServiceTab[] | null>(null);
  const [selectedTab, setSelectedTab] = useState<MusicServiceTab | null>(null);

  useEffect(() => {
    if (isInPopup()) {
      chrome.tabs.query({ url: ALL_URL_MATCHES }, (tabs) => {
        const musicServiceTabs = tabs.map(createMusicServiceTab);
        setTabs(musicServiceTabs);

        if (musicServiceTabs.length === 1) {
          setSelectedTab(musicServiceTabs[0]);
        }
      });
    } else {
      const musicServiceTab = createMusicServiceTab();
      setTabs([musicServiceTab]);
      setSelectedTab(musicServiceTab);
    }
  }, []);

  const value: MusicServiceContextValue = {
    tabs,
    selectedTab,
    setSelectedTab
  };

  return (
    <MusicServiceContext.Provider value={value}>
      {children}
    </MusicServiceContext.Provider>
  );
};

export const useMusicService = () => useContext(MusicServiceContext);

const isInPopup = function () {
  return typeof chrome != undefined && chrome.extension
    ? chrome.extension.getViews({ type: 'popup' }).length > 0
    : null;
};

type CallbackFn = (message: any) => void;

const addListener = (callback: CallbackFn): CallbackFn => {
  const inPopup = isInPopup();

  if (inPopup) {
    chrome.runtime.onMessage.addListener(callback);
    return callback;
  } else {
    const wrappedCallback = (event: CustomEvent) => {
      callback(event.detail.body);
    };

    window.addEventListener(ContentEvent.TO_CONTENT, wrappedCallback);

    return wrappedCallback;
  }
};

const removeListener = (callback: CallbackFn) => {
  const inPopup = isInPopup();

  if (inPopup) {
    chrome.runtime.onMessage.removeListener(callback);
  } else {
    window.removeEventListener(ContentEvent.TO_CONTENT, callback);
  }
};

const createSendMessage = (tab?: chrome.tabs.Tab) => (message: any) => {
  const inPopup = isInPopup();

  if (inPopup && tab) {
    chrome.tabs.sendMessage(tab.id, message);
  } else {
    window.dispatchEvent(
      new CustomEvent(ContentEvent.TO_CONTENT, {
        detail: {
          body: message
        }
      })
    );
  }
};

const createMusicServiceTab = (tab?: chrome.tabs.Tab): MusicServiceTab => {
  const inPopup = isInPopup();
  const url = inPopup ? tab?.url : window.location.href;

  if (!url) {
    throw new Error('No URL provided');
  }

  const musicService = getMusicServiceFromUrl(url);

  return {
    musicService,
    addListener,
    removeListener,
    sendMessage: createSendMessage(tab)
  };
};
