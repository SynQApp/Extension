import { mainWorldToBackground } from './mainWorldToBackground';

/**
 * A util function to fetch data from the background script from a MAIN world content script through the message relay.
 */
export const backgroundFetch = async (
  input: RequestInfo | URL,
  init?: RequestInit
) => {
  console.log('Fetching from background', input, init);

  // Send message to background script via the message relay script
  return mainWorldToBackground({
    name: 'BACKGROUND_FETCH',
    body: {
      input,
      init
    }
  });
};
