import { mainWorldToBackground } from './mainWorldToBackground';

/**
 * A util function to fetch data from the background script from a MAIN world content script
 * through the message relay.
 */
export const backgroundFetch = async (
  input: RequestInfo | URL,
  init?: RequestInit
) => {
  return mainWorldToBackground({
    name: 'BACKGROUND_FETCH',
    body: {
      input,
      init
    }
  });
};
