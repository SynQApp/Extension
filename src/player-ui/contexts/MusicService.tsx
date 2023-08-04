// import React, { createContext, useContext, useEffect, useState } from 'react';

// import { ALL_URL_MATCHES } from '~constants/urls';
// import type { MusicService } from '~types/MusicService';
// import { getMusicServiceFromUrl } from '~util/musicService';

// interface MusicServiceTab {
//   addListener: (callback: (message: any) => void) => void;
//   removeListener: (callback: (message: any) => void) => void;
//   sendMessage: (message: any) => void;
//   musicService: MusicService;
//   /**
//    * The underlying tab object from the Chrome API if we're running from the popup context.
//    */
//   tab?: chrome.tabs.Tab;
// }

// interface MusicServiceContextValue {
//   tabs: MusicServiceTab[] | null;
//   selectedTab: MusicServiceTab | null;
//   setSelectedTab: React.Dispatch<React.SetStateAction<number | null>>;
// }

// const MusicServiceContext = createContext<MusicServiceContextValue | null>(null);

// interface SelectedMusicServiceProviderProps {
//   children: React.ReactNode;
// }

// /**
//  * Returns the selected tab ID and a function to set the selected tab ID.
//  * Automatically selects the tab if there is only one. Otherwise, the tab
//  * must be selected manually.
//  */
// export const MusicServiceProvider = ({ children }: SelectedMusicServiceProviderProps) => {
//   const [tabs, setTabs] = useState<MusicServiceTab[] | null>(null);
//   const [selectedTab, setSelectedTab] = useState<MusicServiceTab | null>(null);

//   useEffect(() => {

//   }, []);

//   const value: MusicServiceContextValue = {

//   };

//   return <MusicServiceContext.Provider value={value}>{children}</MusicServiceContext.Provider>;
// };

// export const useMusicService = () => useContext(MusicServiceContext);

// const isInPopup = function() {
//   return (typeof chrome != undefined && chrome.extension) ?
//       chrome.extension.getViews({ type: "popup" }).length > 0 : null;
// }

// const addListener = (callback: (message: any) => void) => {
//   const inPopup = isInPopup();

//   if (inPopup) {
//     chrome.runtime.onMessage.addListener(callback);
//   } else {
//     window.addEventListener('SynQ:ToContent', (event: CustomEvent) => {
//       callback(event.detail.body);
//     });
//   }
// }

// const createMusicServiceTab = (tab?: chrome.tabs.Tab): MusicServiceTab => {
//   const inPopup = isInPopup();
//   const url = inPopup ? tab?.url : window.location.href;

//   if (!url) {
//     throw new Error('No URL provided');
//   }

//   const musicService = getMusicServiceFromUrl(url);

//   return {
//     musicService,
//     tab,

//   }
// };
