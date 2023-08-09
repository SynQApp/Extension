import { ContentEvent } from '~types';

export const sendMessageResponse = (response: any, requestId: string) => {
  window.dispatchEvent(
    new CustomEvent(`${ContentEvent.FROM_CONTENT}:${requestId}`, {
      detail: {
        body: response
      }
    })
  );
};
