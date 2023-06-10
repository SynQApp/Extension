/**
 * Calls the given function when the document is ready.
 */
export const onDocumentReady = (fn: () => void) => {
  if (
    document.readyState === 'complete' ||
    document.readyState === 'interactive'
  ) {
    setTimeout(fn, 1);
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
};
