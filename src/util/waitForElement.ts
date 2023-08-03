/**
 * Wait for an element to appear on the page.
 * @param selector The CSS selector to wait for.
 * @param timeout The timeout to wait for in milliseconds.
 * @param all Whether to return all matching elements.
 */
export function waitForElement(
  selector: string,
  timeout?: number,
  all?: false
): Promise<Element>;

export function waitForElement(
  selector: string,
  timeout?: number,
  all?: true
): Promise<NodeListOf<Element>>;

export function waitForElement(
  selector: string,
  timeout = 10000,
  all?: boolean
): Promise<Element | NodeListOf<Element>> {
  const startTime = Date.now();

  return new Promise((resolve, reject) => {
    const element = all
      ? document.querySelectorAll(selector)
      : document.querySelector(selector);

    if (element) {
      resolve(element);
      return;
    }

    const observer = new MutationObserver((mutations, observerInstance) => {
      const element = all
        ? document.querySelectorAll(selector)
        : document.querySelector(selector);

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
}
