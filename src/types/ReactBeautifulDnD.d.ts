import * as reactBeautifulDnd from 'react-beautiful-dnd';

declare module 'react-beautiful-dnd' {
  export interface DragDropContextProps {
    /**
     * The HTML element to insert the react-beautiful-dnd styles into.
     */
    stylesInsertionPoint: HTMLElement;
  }
}

declare module '@synq/react-beautiful-dnd' {
  export * from 'react-beautiful-dnd';
}
