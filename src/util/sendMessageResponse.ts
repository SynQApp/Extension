export const sendMessageResponse = (response: any, requestId: string) => {
  window.dispatchEvent(
    new CustomEvent(`SynQEvent:FromContent:${requestId}`, {
      detail: {
        body: response
      }
    })
  );
};
