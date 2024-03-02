import type { PlasmoCSConfig } from 'plasmo';
import type { Store } from 'redux';
import type { StoreEnhancerStoreCreator } from 'redux';
import { type StoreEnhancer } from 'redux';

export const config: PlasmoCSConfig = {
  matches: ['*://music.amazon.com/*'],
  all_frames: true,
  world: 'MAIN',
  run_at: 'document_start'
};

/**
 * Below is a highly modified version of: https://github.dev/reduxjs/redux-devtools/blob/main/extension/src/pageScript/index.ts
 */

interface ComposeConfig {
  name?: string;
}

window.__REDUX_STORES__ = [];

/**
 * A custom compose function which exposes the store on the window object.
 */
const synqCompose =
  (config: ComposeConfig) =>
  (...funcs: StoreEnhancer[]): StoreEnhancer => {
    return (...args) => {
      // Amazon Music passes in a single StoreEnhancer function. Calling it returns
      // a StoreEnhancerStoreCreator function which is used to create a Redux store.
      const createStore = funcs[0](...args);

      // We return a new StoreEnhancerStoreCreator function which wraps createStore
      // so we can expose the store on the window object.
      return ((...enhancerArgs) => {
        const store = createStore(...enhancerArgs) as unknown as Store & {
          name: string;
        };

        // We need to set the name of the store so that we can find it later.
        (store as any).name = config.name;
        window.__REDUX_STORES__.push(store);

        return store;
      }) as StoreEnhancerStoreCreator;
    };
  };

/**
 * Redux provides a browser extension for debugging Redux applications. It works by
 * exposing a global variable called __REDUX_DEVTOOLS_EXTENSION_COMPOSE__ which the host
 * application can use to compose their Redux store. Amazon Music checks if this variable
 * is defined, and if it is, it uses it to compose its store. We can use this to inject
 * our own compose function which exposes the store on the window object for us to use.
 */
Object.defineProperty(window, '__REDUX_DEVTOOLS_EXTENSION_COMPOSE__', {
  get: () => {
    return synqCompose;
  },
  set: () => {
    /**
     * Preventing Redux Dev Tools from setting the compose function in case a user
     * has it installed and it gets called after our code.
     */
    console.info(
      'PREVENTING REDUX DEV TOOLS FROM SETTING COMPOSE. If you want to use Redux Dev Tools, please disable SynQ temporarily.'
    );
  }
});
