export const generateRequestId = () => {
  return Math.random().toString(36).substring(7);
};
