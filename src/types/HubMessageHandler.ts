export type HubMessageHandler<T> = (
  message: T,
  sender: chrome.runtime.MessageSender,
  sendResponse: (response: any) => void
) => any | Promise<any>;
