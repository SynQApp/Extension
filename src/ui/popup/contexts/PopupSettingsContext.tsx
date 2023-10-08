import React, { createContext, useContext } from 'react';

export interface PopupSettingsContextValue {
  queueCollapsible: boolean;
  document: Document;
}

const DEFAULT_POPUP_SETTINGS: PopupSettingsContextValue = {
  queueCollapsible: true,
  document: document
};

const PopupSettingsContext = createContext<PopupSettingsContextValue>(
  DEFAULT_POPUP_SETTINGS
);

interface PopupSettingsProviderProps {
  children: React.ReactNode;
  value?: PopupSettingsContextValue;
}

/**
 * Returns the selected tab ID and a function to set the selected tab ID.
 * Automatically selects the tab if there is only one. Otherwise, the tab
 * must be selected manually.
 */
export const PopupSettingsProvider = ({
  children,
  value
}: PopupSettingsProviderProps) => {
  return (
    <PopupSettingsContext.Provider value={value ?? DEFAULT_POPUP_SETTINGS}>
      {children}
    </PopupSettingsContext.Provider>
  );
};

export const usePopupSettings = () => useContext(PopupSettingsContext);
