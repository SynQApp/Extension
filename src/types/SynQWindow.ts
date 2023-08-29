import type { Store } from 'redux';

export {};

type StoreWithName = Store & { name: string };

declare global {
  interface Window {
    _SYNQ_SELECTED_TAB: boolean;
    __REDUX_STORES__: StoreWithName[];
  }
}
