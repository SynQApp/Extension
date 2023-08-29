/*
 * Based on code from the Amazon Music Sources tab in the browser devtools,
 * Skyfire is the name of the Amazon Music service. These utils are taken from
 * the Sources tab.
 */

export const convertToAscii = (str: string) => {
  // eslint-disable-next-line no-control-regex
  return str.replace(/[^\x00-\x7F]/g, (c) => unescape(encodeURIComponent(c)));
};

export const generateRequestId = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};
