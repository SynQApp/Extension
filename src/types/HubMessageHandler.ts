export type HubMessageHandler<T> = (
  message: T,
  sender: chrome.runtime.MessageSender | undefined,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sendResponse: (response: any) => void
) => void;
