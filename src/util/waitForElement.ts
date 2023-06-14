// Wait for an element to appear on the page using MutationObserver
export const waitForElement = async (
  selector: string,
  timeout = 10000
): Promise<Element> => {
  const startTime = Date.now();

  return new Promise((resolve, reject) => {
    const observer = new MutationObserver((mutations, observerInstance) => {
      const element = document.querySelector(selector);

      if (element) {
        observerInstance.disconnect();
        resolve(element);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    const interval = setInterval(() => {
      if (Date.now() - startTime > timeout) {
        clearInterval(interval);
        observer.disconnect();
        reject(new Error(`Timeout waiting for element: ${selector}`));
      }
    }, 100);
  });
};
