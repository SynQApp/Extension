export {};
console.log('HELLO WORLD FROM BGSCRIPTS');

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'screenshot') {
    chrome.tabs.captureVisibleTab((screenshotUrl) => {
      sendResponse({ screenshotUrl });
    });

    return true;
  }
});
