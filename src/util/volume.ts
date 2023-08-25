export const normalizeVolume = (volume: number) => {
  return Math.max(0, Math.min(100, volume));
};
